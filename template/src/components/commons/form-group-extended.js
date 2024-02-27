
// outsource dependencies
import cn from 'classnames';
import React, { memo } from 'react';
import PropTypes from 'prop-types';


export const FormGroupExtended = memo(function FormGroupExtended (props) {
  const {
    className,
    row,
    disabled,
    check,
    inline,
    floating,
    tag: Tag,
    ...attributes
  } = props;

  const formCheck = check || props.switch;

  if (Tag === 'fieldset') {
    attributes.disabled = disabled;
  }

  return (
    <Tag {...attributes} className={cn('form-group', {
      row: row,
      'form-check': formCheck,
      'form-switch': props.switch,
      'form-check-inline': formCheck && inline,
      disabled: formCheck && disabled,
      'form-floating': floating
    }, className)} />
  );
});
FormGroupExtended.propTypes = {
  // eslint-disable-next-line react/require-default-props
  row: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  check: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  switch: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  inline: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  floating: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  disabled: PropTypes.bool,
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
  // eslint-disable-next-line react/require-default-props
  className: PropTypes.string,
  tag: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
    PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.string,
      PropTypes.shape({ $$typeof: PropTypes.symbol, render: PropTypes.func }),
    ]))
  ])
};
FormGroupExtended.defaultProps = {
  tag: 'div',
  // row: false,
  // check: false,
  // switch: false,
  // inline: false,
  // floating: false,
  // disabled: false,
  // className: 'mb-3',
  // children: PropTypes.node
};
