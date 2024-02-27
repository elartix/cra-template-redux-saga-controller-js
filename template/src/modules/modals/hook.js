// outsource dependencies
import _ from 'lodash';
import { useCallback, useEffect, useMemo } from 'react';
import { useControllerActions, useControllerData } from 'redux-saga-controller';

// local dependencies
import { modalCtrl } from './controller';

export const useModal = uid => {
  const { registered } = useControllerData(modalCtrl);
  // eslint-disable-next-line max-len
  const { open, close, load, select, updateModal, resolve, reject, initialize, submit } = useControllerActions(modalCtrl);
  // NOTE take in mind the universal handlers require implementation fo each modal separated
  return [
    // NOTE state
    useMemo(() => _.find(registered, { uid }) || {}, [registered, uid]),
    {
      // NOTE reserved
      open: useCallback(options => open({ ...options, uid }), [open, uid]),
      load: useCallback(options => load({ ...options, uid }), [load, uid]),
      select: useCallback(options => select({ ...options, uid }), [select, uid]),
      close: useCallback(options => close({ ...options, uid }), [close, uid]),
      submit: useCallback(options => submit({ ...options, uid }), [submit, uid]),
      updateModal: useCallback(options => updateModal({ ...options, uid }), [updateModal, uid]),
      // NOTE free
      reject: useCallback(options => reject({ ...options, uid }), [reject, uid]),
      resolve: useCallback(options => resolve({ ...options, uid }), [resolve, uid]),
      initialize: useCallback(options => initialize({ ...options, uid }), [initialize, uid]),
    }
  ];
};
export const useModalSubscribe = uid => {
  const { register, unregister } = useControllerActions(modalCtrl);
  useEffect(() => {
    register({ uid });
    return () => unregister({ uid });
  }, [register, unregister, uid]);
};
