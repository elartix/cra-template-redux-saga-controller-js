
// outsource dependencies
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';


// local dependencies
import { SystemHeader } from './system-header';
import { history, noop } from '../../../constants';
import { BoxPreloader } from '../../../components/commons';

// eslint-disable-next-line max-len
export const SystemLayout = memo(function SystemLayout ({ children, className, hasFooter, hasHeader, header: HeaderComponent, leftControlAction, rightControlAction, classNameHeader, initialized, showLeftControl, showRightControl }) {
  return <>
    { hasHeader && HeaderComponent
      && <HeaderComponent
        className={classNameHeader}
        showLeftControl={showLeftControl}
        showRightControl={showRightControl}
        leftControlAction={leftControlAction}
        rightControlAction={rightControlAction}
    /> }
    <main className={cn('system-layout system-page', {
      'h-100': !hasHeader,
      'system-page-with-footer': hasFooter,
      'system-page-with-header': hasHeader && HeaderComponent
    }, className)}>
      <BoxPreloader active={!initialized}>{ children }</BoxPreloader>
    </main>
  </>;
});

SystemLayout.propTypes = {
  hasHeader: PropTypes.bool,
  hasFooter: PropTypes.bool,
  className: PropTypes.string,
  classNameHeader: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.elementType,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  header: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.element,
    PropTypes.elementType,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  initialized: PropTypes.bool,
  showLeftControl: PropTypes.bool,
  showRightControl: PropTypes.bool,
  leftControlAction: PropTypes.func,
  rightControlAction: PropTypes.func,
};

SystemLayout.defaultProps = {
  className: '',
  classNameHeader: '',
  hasFooter: false,
  hasHeader: false,
  initialized: true,
  header: SystemHeader,
  showLeftControl: true,
  showRightControl: true,
  rightControlAction: noop,
  leftControlAction: () => history.goBack(),
};
