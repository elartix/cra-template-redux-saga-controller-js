
// outsource dependencies
import cn from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button, Input } from 'reactstrap';
import React, { useCallback, memo, useEffect, useState } from 'react';


// local dependencies
import { AppIcon } from '../icons';
import { FormGroupExtended } from '../commons';
import { RFControlFormGroup, RFControlFormInputGroup } from '../redux-form-helpers';

// eslint-disable-next-line max-len
export const RFControlInputGroupPassword = memo(function RFControlInputGroupPassword ({ input, type, meta, label, floating, skipTouch, classNameFormGroup, classNameInputGroup, filter, clearOnUnmount, setFocused, classNamePlainPasswordBtn, showPlainPassword, ...attr }) {
  const { name, onChange, onBlur } = input;
  const [passwordShown, setPasswordShown] = useState(showPlainPassword);
  const [inputGroupFocused, setInputGroupFocus] = useState(false);
  // NOTE controlled feature to clearing redux form field value on component unmount
  useEffect(() => clearOnUnmount ? () => onChange(null) : void 0, [onChange, clearOnUnmount]);
  // NOTE prepare input actions
  const handleDrop = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    switch (type) {
      default: return; // NOTE do nothing by default
      case 'text': return onChange(filter(event.dataTransfer.getData('text')));
    }
  }, [type, onChange, filter]);

  const handleBlur = useCallback(event => {
    onBlur(filter(event.target.value));
    setInputGroupFocus(false);
  }, [onBlur, filter]);
  const handleChange = useCallback(event => onChange(filter(event.target.value)), [onChange, filter]);

  // NOTE handle valid/invalid state and error message for input
  let message = '';
  // console.log(meta)
  // console.log(attr.className)
  if (skipTouch || (meta.touched && meta.error)) {
    message = meta.error;
    attr.className += meta.valid ? ' is-valid' : ' is-invalid';
    attr.className += meta.asyncValidating ? ' is-validating' : '';
  }

  if (skipTouch || meta.asyncValidating) {
    attr.className += meta.asyncValidating ? ' is-validating' : '';
  }
  // console.log(attr.className)
  return <RFControlFormInputGroup
    id={name}
    label={label}
    message={message}
    floating={floating}
    className={classNameFormGroup}
    classNameInputGroup={cn('flex-nowrap', {
      'input-group-focused': inputGroupFocused,
      'input-group-outlined': true,
      'input-group-is-invalid is-invalid has-validation': meta.touched && !meta.valid,
      'input-group-is-valid is-valid has-validation': meta.touched && meta.valid,
    }, classNameInputGroup)}
  >
    <FormGroupExtended
      floating={floating}
      className={cn('w-100')}
    >
      <Input
        dir="auto"
        type={!passwordShown ? type : 'text'}
        id={name}
        autoComplete="off"
        {...input}
        {...attr}
        onFocus={() => setInputGroupFocus(true)}
        onDrop={handleDrop}
        onBlur={handleBlur}
        onChange={handleChange}
        ref={input => setFocused(input)}
      />
      { !label ? null : !floating ? null : <label className="form-label" htmlFor={name}> { label } </label> }
    </FormGroupExtended>
    <Button
      color={'input-group-control'}
      // disabled={_.isEmpty(input.value)}
      className={cn(classNamePlainPasswordBtn, {
        // 'border-danger': meta.touched && meta.invalid,
        // 'border-gray-400': !(meta.touched && meta.invalid) && !inputGroupFocused,
        // 'border-gray-500': !(meta.touched && meta.invalid) && inputGroupFocused,
        // 'border-green': !meta.invalid && meta.pristine,
      })}
      data-meta-invalid={!meta.invalid}
      data-meta-valid={meta.valid}
      onClick={() => setPasswordShown(!passwordShown)}
    >
      <AppIcon icon={!passwordShown ? 'eye-open': 'eye-close'} fillRule="evenodd" />
      {/*<FasIcon icon={!passwordShown ? 'eye': 'eye-slash'} />*/}
    </Button>
  </RFControlFormInputGroup>;
});

RFControlInputGroupPassword.propTypes = {
  type: PropTypes.string,
  filter: PropTypes.func,
  floating: PropTypes.bool,
  skipTouch: PropTypes.bool,
  setFocused: PropTypes.func,
  className: PropTypes.string,
  meta: PropTypes.object.isRequired,
  showPlainPassword: PropTypes.bool,
  input: PropTypes.object.isRequired,
  label: RFControlFormGroup.propTypes.label,
  classNameFormGroup: RFControlFormGroup.propTypes.className,
  classNameInputGroup: RFControlFormGroup.propTypes.className,
  classNamePlainPasswordBtn: RFControlFormGroup.propTypes.className,
};

RFControlInputGroupPassword.defaultProps = {
  label: null,
  type: 'text',
  className: '',
  filter: e => e,
  skipTouch: false,
  floating: false,
  setFocused: e => e,
  classNameInputGroup: '',
  showPlainPassword: false,
  classNameFormGroup: 'mb-4',
  classNamePlainPasswordBtn: 'btn-input-group'
};

export default RFControlInputGroupPassword;

