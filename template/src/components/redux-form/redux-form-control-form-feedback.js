
// outsource dependencies
import _ from 'lodash';
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Label, FormFeedback, Fade } from 'reactstrap';

/**
 * Show form error using prepared label
 */
export const LabelError = memo(function LabelError ({ message, htmlFor, className }) {
  return !message ? null : <Label htmlFor={htmlFor} className={cn('d-block', className)}>
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

export const RFControlFormFeedback = memo(function RFControlFormFeedback ({ message, htmlFor, className }) {
  return _.isEmpty(message) ? null : <FormFeedback tag={Fade} className="invalid-feedback-group" in={!_.isEmpty(message)}>
    { _.isArray(message)
      ? message.map(item => <LabelError key={item} htmlFor={htmlFor} message={item} className={className} />)
      : <LabelError htmlFor={htmlFor} message={message} className={className} /> }
  </FormFeedback>;
});
RFControlFormFeedback.propTypes = {
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
};
RFControlFormFeedback.defaultProps = {
  htmlFor: null,
  message: null,
  className: '',
};
