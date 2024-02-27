// outsource dependencies
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useControllerActions, useControllerData } from 'redux-saga-controller';

// local dependencies
import { appRootCtrl } from './pages/controller';

/**
 * logged user or null if it was not logged
 */
export const useSelf = () => useControllerData(appRootCtrl).user;
export const useSelfId = () => {
  const self = useSelf();
  return useMemo(() => _.get(self, 'id'), [self]);
};
/**
 * common detection of authorization
 */
export const useIsAuthorized = () => {
  const self = useSelf();
  return useMemo(() => Boolean(self), [self]);
};
/**
 * common list of static countries
 */
export const useCountries = () => {
  const { getCountries } = useControllerActions(appRootCtrl);
  useEffect(() => getCountries({}), [getCountries]);
  return useControllerData(appRootCtrl).countries;
};
/**
 * common list of static languages
 */
export const useLanguages = () => {
  const { getLanguages } = useControllerActions(appRootCtrl);
  useEffect(() => getLanguages({}), [getLanguages]);
  return useControllerData(appRootCtrl).languages;
};
/**
 *
 * @param initialState
 * @returns {[boolean,((function(*): void)|*)]}
 */
export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback((newState) => {
    if (newState !== undefined && newState !== state) {
      setState(newState);
    } else if (newState === undefined) {
      setState(!state);
    }
  }, [state]);

  return [state, toggle];
};

export const useSimpleToggle = (initialState = false) => {
  const [toggle, setToggle] = useState(initialState);
  const handleUpdateToggle = useCallback(() => setToggle(prevState => !prevState), []);
  return [toggle, handleUpdateToggle];
};

/**
 * correct extract ref to provide ability use ref with "useEffect" hook
 */
export const useRefCallback = () => {
  const [stored, set] = useState(null);
  // NOTE prevent update "reference" within render
  const ref = useCallback(api => api && set(api), []);
  return [stored, ref];
};

/**
 * Use focus for input
 * @returns {[React.MutableRefObject<null>,setElemFocus,(function(*): *)]}
 */
export const useFocus = () => {
  const elemRef = useRef(null);

  const setElemFocus = useCallback(() => {
    elemRef.current && elemRef.current.focus();
  }, []);
  /**
   * Set new Ref
   * @param ref
   */
  const setRef = (ref) => elemRef.current = ref;

  return [elemRef, setElemFocus, setRef];
};
