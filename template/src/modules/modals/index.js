
// outsource dependencies
import React, { memo } from 'react';
import { useControllerSubscribe } from 'redux-saga-controller';

// local dependencies
import { modalCtrl } from './controller';
import { ImageCropModal } from './image-crop';

// addition exports
export { modalCtrl };
export * from './image-crop';

export const ModalIndex = memo(function ModalIndex () {
  // NOTE take in mind the controller should be subscribed before modals start registration
  const isSubscribed = useControllerSubscribe(modalCtrl);

  return isSubscribed && <>
    <ImageCropModal />
    {/* TODO probably by requirements usages but let it be here for now */}
  </>;
});
