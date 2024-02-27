
// outsource dependencies
import _ from 'lodash';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Input, Label } from 'reactstrap';
import React, { memo, useCallback, useMemo } from 'react';

export const RFControlCheckbox = memo(function RFControlCheckbox ({ skipTouch, input, meta, classNameLabel, ...attributes }) {
  const handleChange = useCallback(value => input.onChange(value), [input]);
  let message = '';
  if (skipTouch || (meta.touched && meta.error)) {
    message = meta.error;
    attributes.className += meta.valid ? ' is-valid' : ' is-invalid';
  }

  return <CheckboxCustom {...input} {...attributes} message={message} classNameLabel={classNameLabel} onChange={handleChange} />;
});
RFControlCheckbox.propTypes = {
  skipTouch: PropTypes.bool,
  classNameLabel: PropTypes.string,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
};
RFControlCheckbox.defaultProps = {
  classNameLabel: '',
  skipTouch: false,
};


export const Checkbox = memo(function Checkbox (props) {
  const { uid, type, name, onChange, className, value, disabled, ...attr } = props;
  const handleChange = useCallback(({ target }) => onChange(target.checked), [onChange]);
  return <Input
    id={uid}
    type={type}
    name={name}
    disabled={disabled}
    onChange={handleChange}
    checked={Boolean(value)}
    className={cn('border-primary me-2 flex-shrink-0 bg-transparent', className, { 'cursor-pointer': !disabled })}
    {...attr}
  />;
});

Checkbox.propTypes = {
  disabled: PropTypes.bool,
  className: PropTypes.string,
  uid: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number, PropTypes.string]).isRequired,
};
Checkbox.defaultProps = {
  disabled: false,
  className: '',
};

export const CheckboxCustom = memo(function CheckboxCustom (props) {
  const {
    label, type, name, message, classNameLabel, classNameGroup, disabled, id, ...attr
  } = props;
  const uid = useMemo(() => id ? _.kebabCase(`${type}-${name}-${id}`) : _.kebabCase(`${type}-${name}`), [id, name, type]);

  return <div className={classNameGroup}>
    <Checkbox uid={uid} type={type} name={name} disabled={disabled} {...attr}/>
    { label ? <Label
      check
      for={uid}
      className={cn('fw-400 mb-0', classNameLabel, { 'app-invalid-feedback': message, 'cursor-pointer': !disabled, 'text-gray-400 pe-none': disabled })}
    >
      { label }
    </Label> : null }
  </div>;
});
CheckboxCustom.propTypes = {
  id: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  message: PropTypes.string,
  classNameLabel: PropTypes.string,
  classNameGroup: PropTypes.string,
};
CheckboxCustom.defaultProps = {
  name: 'checkboxCustom',
  id: 'checkboxCustom',
  classNameLabel: '',
  classNameGroup: '',
  type: 'checkbox',
  disabled: false,
  message: '',
  label: '',
};
