import _ from 'lodash';

export const urlRegExp = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/;
/**
 * checks - is this string can be url
 *
 * @param {String} string
 * @returns {Boolean}
 */
export const isUrl = (string = '') => urlRegExp.test(string);

/**
 *
 * @param {File} file
 * @param {Number} [minKB=1]
 * @param {Number} [maxMB=1.1]
 * @return {Error|Boolean}
 */
export const validateFileSize = (file, minKB = 1, maxMB = 1.1) => {
  if (!isFile(file)) {
    return new Error('Not a valid file');
  }
  const size = file.size;
  const KB = Math.floor(Number(size / 1024));
  const MB = Math.ceil(Number(size / (1024 * 1024)));
  if (KB < minKB) {
    return new Error(`File size is too small (${KB}kb), it should be at least ${Math.floor(minKB)}kb`);
  }
  if (MB > maxMB) {
    return new Error(`File size is too big (${MB}Mb), it should be less than ${Math.floor(maxMB)}Mb`);
  }

  return false;
};

/**
 *
 * @param {File} file
 * @param {Number} [width=1]
 * @param {Number} [height=1.1]
 * @return {Error|Boolean}
 */
export const validateImageFileResolution = async (file, width = 1, height = 1.1) => {
  if (!isFile(file) && !isImage(file)) {
    return new Error('Not a valid file');
  }
  const previewUrl = URL.createObjectURL(file);
  const img = new Image();
  img.src = previewUrl;
  await fileCallbackToPromise(img);
  URL.revokeObjectURL(previewUrl);

  if (img.width > width) {
    return new Error(`Image width is too big (${img.width}), it should be less than ${Math.floor(width)} or equal`);
  }

  if (img.height > height) {
    return new Error(`Image height is too big (${img.height}), it should be less than ${Math.floor(height)} or equal`);
  }

  return false;
};

/**
 *
 * @param {string} type
 * @returns {boolean}
 */
export const isImage = (type) => _.isString(type) && type.startsWith('image/');
/**
 *
 * @param {string} type
 * @returns {boolean}
 */
export const isAudio = (type) => _.isString(type) && type.startsWith('audio/');
/**
 *
 * @param {string} type
 * @returns {boolean}
 */
export const isVideo = (type) => _.isString(type) && type.startsWith('video/');
/**
 * check is object correct interface of file
 * @param file
 * @return {boolean}
 */
export const isFile = (file) => {
  return file instanceof File || (
    // NOTE same interface as File
    _.isObject(file)
    && _.isString(file.name)
    && _.isString(file.type)
    && _.isNumber(file.size)
  );
};

/**
 *
 * @param {object} file
 * @param {string} previewUrl
 */
export const destroyPreview = (file, previewUrl) => {
  _.isEmpty(previewUrl)
    ? URL.revokeObjectURL(file.downloadUrl)
    : URL.revokeObjectURL(_.get(file, `${previewUrl}`));
  // eslint-disable-next-line no-console
  // console.log('destroyed preview', file)
};

/**
 *
 * @param {object} fileObj
 * @returns {Promise<Awaited<unknown>>}
 */
const fileCallbackToPromise = (fileObj) => {
  return Promise.race([
    new Promise(resolve => {
      if (fileObj instanceof HTMLImageElement) {
        fileObj.onload = resolve;
      } else {
        fileObj.onloadedmetadata = resolve;
      }
    }),
    new Promise((resolve, reject) => {
      setTimeout(reject, 1000);
    }),
  ]);
};

/**
 *
 * @param {string} dataUrl
 * @returns {Blob}
 */
const dataURLtoBlob = (dataUrl) => {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};


/**
 * create image from file
 *
 * @param {File} file
 * @returns {Promise}
 */
export const fileToDataUrl = (file) => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
};


/**
 * prepare file name
 *
 * @param {string} nameString
 * @param {function} transform
 * @returns {string}
 */
export const prepareFileName = (nameString, transform = (str) => str && str.toLowerCase()) => {
  const name = nameString;
  if (!_.isString(name)) {
    return `image_${Date.now()}`;
  }
  const fileExt = name.slice((Math.max(0, name.lastIndexOf('.')) || Infinity) + 1);
  const fileName = _.isFunction(transform) && transform(name.split('.').slice(0, -1).join('.'));
  // NOTE allowed for names only ASCII
  return `${fileName.replace(/[^\d|A-Z|a-z]/g, '_').replace(/_+/g, '_')}.${fileExt}`;
};

/**
 * get file name from url
 *
 * @param {string} url
 * @returns {string}
 */
export const getFileNameFromUrl = (url) => {
  return isUrl(url)
    ? new URL(decodeURIComponent(url)).pathname.substring(new URL(decodeURIComponent(url)).pathname.lastIndexOf('/') + 1)
    : url;
};

/**
 * Wrap file for feed attach
 * @param {File} file
 * @returns {Promise<{sourceFileEntity, meta: {fileName, fileSize, fileHeight: number, filePreview: string, fileType, fileWidth: number}}>}
 */
export const prepareSelectedFile = async (file) => {
  const objectUrl = URL.createObjectURL(file);
  const resultFile = {
    fileRaw: file,
    fileMeta: {
      fileWidth: 0,
      fileHeight: 0,
      fileType: file.type,
      fileSize: file.size,
      filePreviewUrl: objectUrl,
      fileName: prepareFileName(file.name),
      fileUUID: _.first(objectUrl.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/))
    }
  };

  try {
    if (isImage(resultFile.fileMeta.fileType)) {
      const img = new Image();
      img.src = resultFile.fileMeta.filePreviewUrl;
      await fileCallbackToPromise(img);
      resultFile.fileMeta = {
        ...resultFile.fileMeta,
        fileWidth: img.width,
        fileHeight: img.height
      };
    }

    if (isAudio(resultFile.fileMeta.fileType)) {
      const audio = new Audio();
      audio.src = resultFile.fileMeta.filePreviewUrl;
      await fileCallbackToPromise(audio);
      resultFile.fileMeta = {
        ...resultFile.fileMeta,
        duration: audio.duration
      };
    }

    if (isVideo(resultFile.fileMeta.fileType)) {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      video.src = resultFile.fileMeta.filePreviewUrl;
      video.muted = true;
      video.playsInline = true;

      await fileCallbackToPromise(video);

      video.currentTime = Math.floor(video.duration / 3);
      await video.play();

      setTimeout(() => video.pause(), 500);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      resultFile.fileMeta = {
        ...resultFile.fileMeta,
        duration: video.duration,
        fileWidth: video.videoWidth,
        fileHeight: video.videoHeight,
        fileDataURL: canvas.toDataURL(),
        fileBlobRawData: resultFile.fileMeta.filePreviewUrl,
        filePreviewUrl: URL.createObjectURL(dataURLtoBlob(canvas.toDataURL()))
      };
    }
    if (!isImage(resultFile.fileMeta.fileType)) {
      destroyPreview(resultFile, 'fileMeta.filePreviewUrl');
      destroyPreview(resultFile, 'fileMeta.fileBlobRawData');
    }
  } catch (e) {
    destroyPreview(resultFile, 'fileMeta.filePreviewUrl');
    return Promise.reject(resultFile);
  }
  return Promise.resolve(resultFile);
};

/**
 * Получить информацию о промисе после того, как дождались его завершения.
 * @param {Promise} promise Промис, для которого нужно получить информацию.
 * @returns {Promise<{status:String,value:Any}|{status:String,reason:Error}>} Промис с объектом информации.
 */
const PromiseReflect = promise => {
  return promise.then(
    (result) => ({ status: 'fulfilled', result }),
    (error) => ({ status: 'rejected', error })
  );
};

/**
 * Promises all settled
 * @param {Promise[]} promises Promises list.
 * @returns {Promise[]}. Return array of reflect promises.
 */
// eslint-disable-next-line no-async-promise-executor
export const PromiseAllSettled = promises => new Promise(async (resolve, reject) => {
  const array = [];
  for (const promise of promises) {
    array.push(await PromiseReflect(promise));
  }
  resolve(array);
});
