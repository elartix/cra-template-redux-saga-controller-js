
// outsource dependencies
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { InputGroup } from 'reactstrap';

// local dependencies
import { FormGroupExtended } from '../commons';
import { RFControlFormFeedback } from './redux-form-control-form-feedback';

export const RFControlFormInputGroup = memo(({ label, className, classNameInputGroup, message, id, children, ...attr }) => {
  return <FormGroupExtended { ...attr } className={cn('rf-form-input-group', className)}>
    { attr.floating ? <>
      <InputGroup className={classNameInputGroup}>{ children }</InputGroup>
    </> : <>
      { !label ? null : <label htmlFor={id}> { label } </label> }
      <InputGroup className={classNameInputGroup}>{ children }</InputGroup>
    </> }
    <RFControlFormFeedback message={message} htmlFor={id} />
  </FormGroupExtended>;
});
RFControlFormInputGroup.propTypes = {
  ...RFControlFormFeedback.propTypes,
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.element]),
};
RFControlFormInputGroup.defaultProps = {
  ...RFControlFormFeedback.defaultProps,
  label: null,
  className: 'mb-4',
};
