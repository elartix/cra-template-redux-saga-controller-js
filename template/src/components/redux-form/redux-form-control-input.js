
// outsource dependencies
import _ from 'lodash';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import React, { useCallback, memo, useEffect } from 'react';

// local dependencies
import { RFControlFormGroup } from '../redux-form';

// eslint-disable-next-line max-len
export const RFControlInput = memo(function RFControlInput ({ input, type, meta, label, floating, skipTouch, classNameFormGroup, filter, clearOnUnmount, setFocused, showOnlyInvalid, asterisk, ...attr }) {
  const { name, onChange, onBlur } = input;

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

  const handleBlur = useCallback(event => onBlur(filter(event.target.value)), [onBlur, filter]);
  const handleChange = useCallback(event => onChange(filter(event.target.value)), [onChange, filter]);

  // NOTE handle valid/invalid state and error message for input
  let message = '';
  if (skipTouch || meta.touched) {
    message = meta.error;
    if (showOnlyInvalid) {
      attr.className += meta.valid ? '' : ' is-invalid';
    } else {
      if (!meta.valid) {
        attr.className += ' is-invalid';
      } else if (!_.isEmpty(input.value) && meta.valid) {
        attr.className += ' is-valid';
      }
      // attr.className += meta.valid ? ' is-valid' : ' is-invalid';
    }
    attr.className += meta.asyncValidating ? ' is-validating' : '';
  }

  if (skipTouch || meta.asyncValidating) {
    attr.className += meta.asyncValidating ? ' is-validating' : '';
  }

  return <RFControlFormGroup
    id={name}
    label={label}
    message={message}
    asterisk={asterisk}
    floating={floating}
    className={cn({ 'text-gray-600': attr.disabled }, classNameFormGroup)}
  >
    <Input
      dir="auto"
      type={type}
      autoComplete="off"
      {...input}
      {...attr}
      id={name}
      onDrop={handleDrop}
      onBlur={handleBlur}
      onChange={handleChange}
      ref={input => setFocused(input)}
      className={cn(attr.className, { 'opacity-50': attr.disabled })}
    />
  </RFControlFormGroup>;
});

RFControlInput.propTypes = {
  type: PropTypes.string,
  filter: PropTypes.func,
  floating: PropTypes.bool,
  showOnlyInvalid: PropTypes.bool,
  skipTouch: PropTypes.bool,
  setFocused: PropTypes.func,
  className: PropTypes.string,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  label: RFControlFormGroup.propTypes.label,
  classNameFormGroup: RFControlFormGroup.propTypes.className
};

RFControlInput.defaultProps = {
  label: null,
  type: 'text',
  filter: e => e,
  floating: false,
  skipTouch: false,
  setFocused: e => e,
  showOnlyInvalid: false,
  classNameFormGroup: 'mb-4',
  className: 'border-gray-400 form-control-input ps-1 py-2 border-start-0 border-top-0 border-end-0 rounded-0 bg-transparent shadow-none fw-normal fs-6'
};
