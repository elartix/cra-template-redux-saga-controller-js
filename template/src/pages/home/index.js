// outsource dependencies
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useCopyToClipboard } from 'react-use';
import { Button, Col, Container } from 'reactstrap';
import React, { memo, useCallback, useEffect } from 'react';
import { useController, useControllerActions } from 'redux-saga-controller';


// local dependencies
import { MainLayout } from 'modules';
import { homeCtrl } from './controller';
import { appRootCtrl } from '../controller';
import { AppIcon } from '../../components/icons';
import { LogoAppRounded } from '../../assets/images';
import { useIsAuthorized, useSelf } from '../../hooks';


export const HomePage = memo(function HomePage ({ className }) {
  const [
    { initialized },
    { initialize },
  ] = useController(homeCtrl);
  const { signOut } = useControllerActions(appRootCtrl);
  const packageInstall = 'npm i redux-saga-controller --save';
  const [, copyToClipboard] = useCopyToClipboard();
  // eslint-disable-next-line no-unused-vars
  const isAuthorized = useIsAuthorized();
  // eslint-disable-next-line no-unused-vars
  const self = useSelf();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // NOTE prepare actions
  // eslint-disable-next-line no-unused-vars
  const handleSignOut = useCallback(() => signOut({}), [signOut]);

  return <MainLayout initialized={initialized} className={cn('d-flex home-page', className, {
    'h-100': !initialized
  })}>
    <div className="main-layout-content w-100 overflow-y-auto overflow-x-hidden bd-masthead">
      <Container fluid="xxl" className="container-xxl bd-gutter">
        <Col className="col-md-8 mx-auto text-center py-6">
          <LogoAppRounded width="200" height="165" alt="Redux-Saga-Controller" className="d-block mx-auto mb-3" />
          <h2 className="mb-3 fw-semibold lh-2">Build fast and responsive React.js site with:<br />Redux-Saga and Bootstrap</h2>
          <p className="lead mb-4">
            Powerful, extensible, and feature-packed toolkit.<br />
            Lets develop our apps super-fast, don&apos;t spend time on creating reducers, actions, action creators & keep your code and file structure simple.
          </p>
          <div className="d-flex flex-column flex-lg-row align-items-md-stretch justify-content-md-center gap-3 mb-4">
            <div className="d-inline-block v-align-middle fs-5">
              <div className="bd-code-snippet">
                <div className="bd-clipboard">
                  <Button
                    title="Copy"
                    type="button"
                    color="clipboard"
                    className="fs-5 border-0 shadow-none"
                    onClick={() => copyToClipboard(packageInstall)}
                  >
                    <AppIcon icon="app-clipboard" />
                  </Button>
                </div>
                <div className="highlight">
                <pre tabIndex="0" className="chroma"><code className="language-sh" data-lang="sh"><span className="line"><span
                  className="cl">{packageInstall}</span></span></code></pre>
                </div>
              </div>
            </div>
            <a
              href="https://redux-saga-controller.js.org/docs/Introductions/getting-started"
              className="btn btn-lg bd-btn-lg btn-primary d-flex align-items-center justify-content-center fw-semibold"
             >
              <AppIcon icon="app-docs" />
              Read the docs
            </a>
          </div>
          <p className="text-muted mb-0">
            Currently <strong>v1.2.0</strong>
            <span className="px-1">·</span>
            <a href="https://github.com/TECH-Rubicone/redux-saga-controller/archive/refs/tags/1.2.0.zip" className="link-secondary">Download</a>
            <span className="px-1">·</span>
            <a href="https://github.com/TECH-Rubicone/redux-saga-controller/releases" className="link-secondary text-nowrap">All releases</a>
          </p>
        </Col>
      </Container>
    </div>
  </MainLayout>;
});

HomePage.propTypes = {
  className: PropTypes.string,
};

HomePage.defaultProps = {
  className: ''
};
