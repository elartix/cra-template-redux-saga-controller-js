
// outsource dependencies
import _ from 'lodash';
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Form, reduxForm } from 'redux-form';
import { Alert, FormGroup, Label } from 'reactstrap';

/**
 * Regular view of errors
 */
export const AlertError = memo(function AlertError ({ message, title, active, onClear, ...attr }) {
  return <Alert color="danger" { ...attr } isOpen={Boolean(message)} toggle={!active ? null : onClear }>
    <strong> { title }: </strong>
    { message }
  </Alert>;
});
AlertError.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string,
  onClear: PropTypes.func,
  message: PropTypes.string,
  className: PropTypes.string,
};
AlertError.defaultProps = {
  title: 'Error ',
  message: null,
  active: false,
  onClear: null,
  className: '',
};

/**
 *
 */
export const RFError = ({ meta }) => !meta.touched ? null : <AlertError message={meta.error} />;

/**
 * Show form error using prepared label
 */
export const LabelError = memo(function LabelError ({ message, htmlFor, className }) {
  return !message ? null : <Label htmlFor={htmlFor} className={cn('invalid-feedback d-block', className)}>
    { _.isString(message) ? message : JSON.stringify(message, null, 4) }
  </Label>;
});
LabelError.propTypes = {
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};
LabelError.defaultProps = {
  htmlFor: null,
  message: null,
  className: '',
};

/**
 * Show form error using prepared error components (bottom label or Popover)
 */
export const ReduxFormControl = memo(({ label, className, message, id, children, ...attr }) => {
  return <FormGroup { ...attr } className={className}>
    { !label ? null : <label htmlFor={id}> { label } </label> }
    { children }
    { _.isArray(message)
      ? message.map(item => <LabelError key={item} htmlFor={id} message={item} />)
      : <LabelError htmlFor={id} message={message} /> }
  </FormGroup>;
});
ReduxFormControl.propTypes = {
  ...LabelError.propTypes,
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.element]),
};
ReduxFormControl.defaultProps = {
  ...LabelError.defaultProps,
  label: null,
  className: '',
};

/**
 * Simplify usage of FieldArray to handle most common situations
 */
export const ReduxFormArrayItems = memo(function ReduxFormArrayItems ({ Item, meta, fields, className, ...attr }) {
  const errors = meta.error;
  return <FormGroup className={cn('rf-array-items', className)}>
    { meta.error && <LabelError message={errors} /> }
    { fields.map((k, i) => <Item
      { ...attr }
      key={i}
      field={k}
      index={i}
      value={fields.get(i)}
    />) }
  </FormGroup>;
});
ReduxFormArrayItems.propTypes = {
  className: PropTypes.string,
  meta: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  Item: PropTypes.elementType.isRequired,
};
ReduxFormArrayItems.defaultProps = {
  className: null,
};

const FormContent = memo(({ onSubmit, handleSubmit, autoComplete, children, className, attr }) => <Form
  // NOTE prepare submit
  noValidate
  onSubmit={handleSubmit(onSubmit)}
  // NOTE map allowed for DOM
  { ...({ autoComplete, className, attr }) }
>
  { children }
</Form>);
FormContent.propTypes = {
  className: PropTypes.string,
  autoComplete: PropTypes.string,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  // handleSubmit: PropTypes.func.isRequired, // NOTE provided by redux-form HOC
};
FormContent.defaultProps = {
  className: null,
  // onSubmit: e => e,
  initialValues: {},
  autoComplete: 'off',
};

/**
 *
 * @see https://redux-form.com/8.2.2/docs/api/reduxform.md
 * @typedef {Object} ReduxFormProps
 * @property {Object} [initialValues={}]
 * @property {Boolean} [destroyOnUnmount=false]
 * @property {Boolean} [enableReinitialize=false]
 * @property {String} [form] FORM_NAME
 * @property {Function} [onSubmit]
 * @example
 onSubmit: formData => console.log('%c RF.onSubmit ', 'color: #000000;'
 , '\n formData: ', formData
 ),
 * @property {Function} [validate]
 * @example
 validate: (values, meta) => console.log('%c RF.validate ', 'color: #000000;'
 , '\n values: ', values
 , '\n meta: ', meta
 ),
 */

/**
 *
 * NOTE provide ability to set redux-form props without passing that props to DOM element
 * @param {ReduxFormProps} options
 * @return {Boolean}
 */
export const ReduxForm = reduxForm({
  enableReinitialize: true,
// NOTE map allowed "reduxForm" HOC pass a lot of properties not allowed for DOM nodes
})(FormContent);
ReduxForm.propTypes = {
  ...FormContent.propTypes,
  validate: PropTypes.func,
  initialValues: PropTypes.object,
  form: PropTypes.string.isRequired,
};
ReduxForm.defaultProps = {
  ...FormContent.defaultProps,
  initialValues: {},
  validate: void(0),
};

export const ReduxFormWizard = reduxForm({
  forceUnregisterOnUnmount: true,
  destroyOnUnmount: false,
})(FormContent);
