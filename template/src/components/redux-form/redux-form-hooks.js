// outsource dependencies
import { useCallback } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { arrayRemoveAll, change, clearFields, destroy, getFormValues, isDirty, isInvalid, isPristine, isValid, reset, submit } from 'redux-form';


/**
 * common way to get values from redux form
 */
export const useFormValues = formName => useSelector(getFormValues(formName)) || {};
/**
 * common way to update field value in redux form
 */
export const useFormValuesUpdate = (formName, field) => {
  const dispatch = useDispatch();
  return useCallback((value, isTouched = false) => dispatch(change(formName, field, value, isTouched)), [dispatch, formName, field]);
};
/**
 * common way to update field value in redux form
 */
export const useFormValueUpdate = (formName) => {
  const dispatch = useDispatch();
  return useCallback((field, value, isTouched = false) => dispatch(change(formName, field, value, isTouched)), [dispatch, formName]);
};
/**
 * common way to submit redux form by name
 */
export const useFormSubmit = formName => {
  const dispatch = useDispatch();
  return useCallback((internalFormName) => dispatch(submit(formName || internalFormName)), [dispatch, formName]);
};
/**
 * common way to update field value in redux form
 */
export const useFormReset = (formName) => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(reset(formName)), [dispatch, formName]);
};
export const useClearFields = () => {
  const dispatch = useDispatch();
  return (formName, ...fields) => dispatch(clearFields(formName, false, false, ...fields));
};
/**
 * Removes all the items from the specified array.
 */
export const useFormArrayRemoveAll = (formName) => {
  const dispatch = useDispatch();
  return useCallback((field) => dispatch(arrayRemoveAll(formName, field)), [dispatch, formName]);
};
export const useFormDestroy = (formName) => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(destroy(formName)), [formName, dispatch]);
};
/**
 * common way to get validation status of redux form by name
 */
export const useFormValidationStatus = () => {
  const store = useStore();

  return useCallback((formName) => {
    const state = store.getState();
    return {
      formIsValid: isValid(formName)(state),
      formIsDirty: isDirty(formName)(state),
      formIsInvalid: isInvalid(formName)(state),
      formIsPristine: isPristine(formName)(state)
    };
  }, [store]);
};
