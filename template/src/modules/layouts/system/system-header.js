// outsource dependencies
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavbarBrand, Button, NavItem, NavLink } from 'reactstrap';


// local dependencies
import { history, HOME } from '../../../constants';
import { AppIcon } from '../../../components/icons';
import { LogoAppFit } from '../../../assets/images';


// eslint-disable-next-line max-len
export const SystemHeader = memo(function SystemHeader ({ className, leftControlAction, leftControlLabel, rightControlAction, rightControlLabel, showLeftControl, showRightControl }) {
  const isDark = false;

  return <Navbar
    light={!isDark}
    dark={isDark}
    fixed="top"
    expand="md"
    container="fluid"
    className={cn('navbar-system-app', {
      'bg-white': !isDark,
      'bg-green-gradient': isDark
    }, className)}
    >
      { showLeftControl && <div className="d-flex justify-content-center">
        <Nav navbar>
          <NavItem>
            <NavLink
              tag={Button}
              type="button"
              color="transparent"
              onClick={leftControlAction}
              className="fs-x-11 d-flex align-items-center">
              <AppIcon icon="arrow-stroke-left" />
              <span className="px-3 fs-x-16 text-gray-900 fw-semi-bold">
                { leftControlLabel }
              </span>
            </NavLink>
          </NavItem>
        </Nav>
      </div> }
      <NavbarBrand className={cn('mx-auto', {
        'pe-16': showLeftControl,
        'ps-16': showRightControl,
      })} tag={Link} to={HOME.LINK()}>
        {isDark ? <LogoAppFit style={{ maxHeight: 37 }} /> : <LogoAppFit style={{ maxHeight: 37 }} />}
      </NavbarBrand>
      { showRightControl && <div className="d-flex justify-content-center">
        <Nav navbar>
          <NavItem>
            <NavLink
              tag={Button}
              type="button"
              color="transparent"
              onClick={rightControlAction}
              className="fs-x-11 d-flex align-items-center">
              <span className="px-3 fs-x-16 text-gray-600 fw-semi-bold">
                { rightControlLabel }
              </span>
            </NavLink>
          </NavItem>
        </Nav>
      </div> }
    </Navbar>;
});

SystemHeader.propTypes = {
  showLeftControl: PropTypes.bool,
  showRightControl: PropTypes.bool,
  leftControlAction: PropTypes.func,
  rightControlAction: PropTypes.func,
  leftControlLabel: PropTypes.string,
  rightControlLabel: PropTypes.string
};

SystemHeader.defaultProps = {
  showLeftControl: false,
  showRightControl: false,
  leftControlLabel: 'Back',
  rightControlLabel: 'Skip',
  leftControlAction: () => history.goBack(),
  rightControlAction: () => history.goBack()
};
