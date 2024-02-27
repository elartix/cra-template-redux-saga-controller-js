
// outsource dependencies
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo, useEffect } from 'react';
import { useController } from 'redux-saga-controller';


// local dependencies
import { MainHeader } from './main-header';
import { mainLayoutCtrl } from './controller';
import { BodyClassName, BoxPreloader } from '../../../components/commons';

// eslint-disable-next-line max-len
export const MainLayout = memo(function MainLayout ({ children, className, header: HeaderComponent, classNameHeader, initialized }) {
  const [
    { isCollapseOpen },
    { initialize, toggleHeaderCollapse },
  ] = useController(mainLayoutCtrl);

  // NOTE initialize business logic
  useEffect(() => { initialize(); }, [initialize]);

  return <BodyClassName className={cn('', {
    'overflow-hidden': isCollapseOpen
  })}>
    { HeaderComponent && <HeaderComponent
      className={classNameHeader}
      isCollapseOpen={isCollapseOpen}
      toggleCollapse={toggleHeaderCollapse}
    /> }
    <main className={cn('main-layout', {
    }, className)}>
      <BoxPreloader active={!initialized}>{ children }</BoxPreloader>
    </main>
  </BodyClassName>;
});

MainLayout.propTypes = {
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
};

MainLayout.defaultProps = {
  className: '',
  classNameHeader: '',
  initialized: true,
  header: MainHeader,
};
