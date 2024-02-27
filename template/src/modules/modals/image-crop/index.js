
// outsource dependencies
import _ from 'lodash';
import React, { memo, useCallback } from 'react';
import { useController } from 'redux-saga-controller';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';


// local dependencies
import { useImageCropModal } from './hook';
import { ImageCropTrigger } from './trigger';
import { imageCropCtrl } from './controller';
import { Preloader } from '../../../components/commons';
import { AlertError } from '../../../components/redux-form';

export { useImageCropModal, ImageCropTrigger };

export const ImageCropModal = memo(function ImageCropModal () {
  const [
    { originalUrl, show, crop, disabled, initialized, imageWidth, modalCentered,
      imageHeight, aspect, errorMessage, btnSuccessClassName, btnDismissClassName
    },
    { updateCtrl, cropImageLoaded, dismiss, apply },
  ] = useController(imageCropCtrl);

  const isApplyDisabled = disabled || _.get(crop, 'width') < 10;
  const handleDismiss = useCallback(() => dismiss(), [dismiss]);
  const handleApply = useCallback(() => apply(), [apply]);
  const handleChange = useCallback(crop => updateCtrl({
    crop: makeAspectCrop({ ...crop, aspect }, imageWidth, imageHeight)
  }), [updateCtrl, aspect, imageWidth, imageHeight]);

  return <Modal id="ImageCropModal" isOpen={show} centered={modalCentered}>
    <ModalHeader tag="h5" className="title"> Select Image Area </ModalHeader>
    <ModalBody className="text-center">
      <Preloader active={!initialized} style={{ height: 300 }}>
        <ReactCrop
          crop={crop}
          src={originalUrl}
          disabled={disabled}
          onChange={handleChange}
          onImageLoaded={cropImageLoaded}
          imageStyle={{ maxHeight: 'none' }}
        />
      </Preloader>
      <AlertError message={errorMessage} className="m-0" />
    </ModalBody>
    <ModalFooter>
      <Button color="transparent" onClick={handleDismiss} className={btnDismissClassName} disabled={disabled}>
        Cancel
      </Button>
      <Button color="primary" onClick={handleApply} className={btnSuccessClassName} disabled={isApplyDisabled}>
        Apply
      </Button>
    </ModalFooter>
  </Modal>;
});
