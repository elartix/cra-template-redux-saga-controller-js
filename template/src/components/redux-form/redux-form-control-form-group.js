
// outsource dependencies
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

// local dependencies
import { Asterisk, FormGroupExtended } from '../commons';
import { RFControlFormFeedback } from './redux-form-control-form-feedback';

export const RFControlFormGroup = memo(({ label, className, message, id, children, asterisk, ...attr }) => {
  return <FormGroupExtended { ...attr } className={cn('rf-form-group', className)}>
    { attr.floating ? <>
      { children }
      { !label ? null : <label className="form-label fw-normal" htmlFor={id}> { label } { asterisk && <Asterisk /> }</label> }
    </> : <>
      { !label ? null : <label htmlFor={id} className="fw-normal"> { label } { asterisk && <Asterisk /> }</label> }
      { children }
    </> }
    <RFControlFormFeedback message={message} htmlFor={id} className="mb-1" />
  </FormGroupExtended>;
});
RFControlFormGroup.propTypes = {
  ...RFControlFormFeedback.propTypes,
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.element]),
};
RFControlFormGroup.defaultProps = {
  ...RFControlFormFeedback.defaultProps,
  label: null,
  className: 'mb-4',
};
