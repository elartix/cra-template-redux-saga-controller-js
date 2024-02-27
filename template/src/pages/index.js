// outsource dependencies
import useVH from 'react-vh';
import ReduxToastr from 'react-redux-toastr';
import React, { memo, useEffect } from 'react';
import { useController } from 'redux-saga-controller';
import { Route, Switch, Router, Redirect } from 'react-router-dom';

// components
import { Preloader, Maintenance, NoMatch } from 'components/commons';

// constants
import { history } from 'constants/store';
import * as ROUTES from 'constants/routes';

// local dependencies
import { HomePage } from './home';
import { appRootCtrl } from './controller';
import { ModalIndex } from '../modules/modals/index';


export default memo(function AppRoot () {
  // NOTE (Mobile-)Browsers implement the vh-unit differently.
  // To avoid layout-inconsistencies and janks,
  // this hook provides a normalized value for vh stored in a global CSS-variable
  // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/#article-header-id-0
  useVH();

  // NOTE subscribe app controller
  const [{ initialized, health }, { initialize }] = useController(appRootCtrl);
  // NOTE initialize business logic
  useEffect(() => {
    initialize();
  }, [initialize]);

  // NOTE select view based on application state
  if (!health) {
    return <Maintenance />;
  }

  if (!initialized) {
    return <Preloader active />;
  }

  return <>
    <Router history={history}>
      <Switch>
        <Route exact path={ROUTES.HOME.ROUTE} component={HomePage} />

        {/* direct 404 */}
        <Route path={ROUTES.NO_MATCH.ROUTE} component={NoMatch} />
        {/* as 404 */}
        <Redirect to={ROUTES.NO_MATCH.ROUTE} />
      </Switch>
      <ModalIndex />
    </Router>
    <ReduxToastr
      progressBar
      timeOut={2000}
      preventDuplicates
      newestOnTop={false}
      position="top-right"
      transitionIn="fadeIn"
      transitionOut="fadeOut"
    />
  </>;
});
