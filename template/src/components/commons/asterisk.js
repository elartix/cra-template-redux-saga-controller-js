import cn from 'classnames';
import React, { memo } from 'react';

export const Asterisk = memo(function Asterisk (props) {
  const { className } = props;
  return <span className={cn('d-inline-block text-danger', className)}>
    *
  </span>;
});
