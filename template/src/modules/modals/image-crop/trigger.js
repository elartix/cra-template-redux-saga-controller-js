
// outsource dependencies
import _ from 'lodash';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import React, { memo, useCallback, useMemo } from 'react';


// local dependencies
import { useImageCropModal } from './hook';
import { useRefCallback } from '../../../hooks';
import { config, DIR } from '../../../constants';
import { validateFileSize } from '../../../components/input-file-helper';

// eslint-disable-next-line max-len
export const ImageCropTrigger = memo(function ImageCropTrigger (props) {
  const { tag: Tag, children, className, accept, aspect,
          minKB, maxMB, validateSize, dir, onCropDone, ...attr } = props;
  const id = useMemo(() => _.uniqueId('hidden-input-'), []);
  const [inputRef, setInputRef] = useRefCallback();
  const [openCropModal] = useImageCropModal();

  // NOTE prepare actions
  const handleClearInput = useCallback(() => { inputRef && inputRef.value && (inputRef.value = null); }, [inputRef]);
  const handleCrop = useCallback(
    file => openCropModal({ file, dir, onSuccess: onCropDone, aspect: Number(aspect) }),
    [openCropModal, dir, onCropDone, aspect]
  );
  const handleFileSelect = useCallback(event => {
    const file = _.get(event, 'target.files.0');
    const error = validateSize(file, minKB, maxMB);
    if (error) {
      const message = _.get(error, 'message');
      toastr.error('', message);
    } else {
      handleCrop(file);
    }
    // NOTE clean up to allow select same file
    setTimeout(handleClearInput, 1e3);
  }, [validateSize, minKB, maxMB, handleClearInput, handleCrop]);

  return <Tag
    { ...(!_.isEqual(attr.type, 'button') && { htmlFor: id }) }
    { ...attr }
    onClick={(e) => {
      if (attr.disabled) {
        e.preventDefault();
        return;
      }
      _.isEqual(attr.type, 'button') && inputRef && inputRef.click();
    }}
    className={cn('image-crop-trigger', className)}
  >
    { children }
    <input
      id={id}
      type="file"
      accept={accept}
      multiple={false}
      ref={setInputRef}
      className="d-none"
      onChange={handleFileSelect}
    />
  </Tag>;
});
ImageCropTrigger.propTypes = {
  minKB: PropTypes.number,
  maxMB: PropTypes.number,
  validateSize: PropTypes.func,
  accept: PropTypes.string,
  multiple: PropTypes.bool,
  className: PropTypes.string,
  onCropDone: PropTypes.func.isRequired,
  dir: PropTypes.oneOf(Object.values(DIR)),
  aspect: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tag: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
    ]))
  ]),
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.element, PropTypes.node]).isRequired,
};
ImageCropTrigger.defaultProps = {
  minKB: 1,
  maxMB: config('MAX_UPLOAD_SIZE', 10),
  validateSize: validateFileSize,
  aspect: '1',
  tag: 'label',
  dir: DIR.USER,
  className: '',
  multiple: false,
  accept: 'image/jpe, image/jpg, image/jpeg, image/png'
};
