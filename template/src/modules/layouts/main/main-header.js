// outsource dependencies
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { memo, useState, useCallback } from 'react';
import { NavLink as RRDNavLink, Link } from 'react-router-dom';
import { Button, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';


// local dependencies
import { noop } from '../../../constants';
import * as ROUTES from 'constants/routes';
import { AppIcon } from '../../../components/icons';
import { LogoAppFit } from '../../../assets/images';


export const MainHeader = memo(function MainHeader ({ className, isCollapseOpen, toggleCollapse }) {
  const isDark = false;

  const [collapseClasses, setCollapseClasses] = useState('');

  // NOTE prepare actions
  const handleToggleCollapse = useCallback(() => toggleCollapse(), [toggleCollapse]);
  const handleCollapseOnExiting = useCallback(() => setCollapseClasses('collapsing-out'), []);
  const handleCollapseOnExited = useCallback(() => setCollapseClasses(''), []);

  return <Navbar
    light={!isDark}
    dark={isDark}
    fixed="top"
    expand="md"
    container="xxl"
    className={cn('navbar-main-app', {
      'bg-white': !isDark,
      'bg-green-gradient': isDark
    }, className)}
  >
    <NavbarBrand tag={Link} to={ROUTES.HOME.LINK()}>
      {isDark ? <LogoAppFit style={{ maxHeight: 37 }} /> : <LogoAppFit style={{ maxHeight: 37 }} />}
    </NavbarBrand>
    <div className="d-flex flex-row">
      <Nav className="ml-md-auto d-md-none flex-row" navbar>
        <NavItem className="mx-0">
          <NavLink
            tag={Button}
            color="nav-icon-link"
            className="nav-link fs-x-18 bg-transparent"
            onClick={() => isCollapseOpen && toggleCollapse()}
          >
            <AppIcon icon="nav-search" />
          </NavLink>
        </NavItem>
        <NavItem className="mx-0">
          <NavLink
            tag={Button}
            color="nav-icon-link"
            className="nav-link fs-x-18 bg-transparent"
            onClick={() => isCollapseOpen && toggleCollapse()}
          >
            <div className="position-relative">
              <AppIcon icon="nav-notification" />
              <span className="position-absolute top-0 start-100 translate-middle p-0-5 bg-danger border border-light rounded-circle">
              <span className="visually-hidden">New alerts</span>
            </span>
            </div>
          </NavLink>
        </NavItem>
      </Nav>
      <NavbarToggler onClick={handleToggleCollapse} />
    </div>

    <Collapse
      navbar
      isOpen={isCollapseOpen}
      onExited={handleCollapseOnExited}
      onExiting={handleCollapseOnExiting}
      className={cn('', collapseClasses)}
    >
      <Nav className="me-auto" navbar>
        <NavItem>
          <NavLink
            exact
            tag={RRDNavLink}
            to={ROUTES.HOME.LINK()}
            activeClassName="active"
            className="nav-link fs-x-16"
            onClick={() => isCollapseOpen && toggleCollapse()}
          >
            <AppIcon icon="nav-home" /> Home
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            tag={RRDNavLink}
            to={ROUTES.HOME.LINK()}
            activeClassName="active"
            className="nav-link fs-x-16"
            onClick={() => isCollapseOpen && toggleCollapse()}
          >
            <AppIcon icon="nav-home" /> TEST
          </NavLink>
        </NavItem>
      </Nav>
      <Nav className="ml-md-auto d-none d-md-flex" navbar>
        <NavItem className="mx-0">
          <NavLink
            tag={Button}
            color="nav-icon-link"
            className="nav-link fs-x-18 bg-transparent"
            onClick={() => isCollapseOpen && toggleCollapse()}
          >
            <AppIcon icon="nav-search" />
          </NavLink>
        </NavItem>
        <NavItem className="mx-0">
          <NavLink
            tag={Button}
            color="nav-icon-link"
            className="nav-link fs-x-18 bg-transparent"
            onClick={() => isCollapseOpen && toggleCollapse()}
          >
            <div className="position-relative">
              <AppIcon icon="nav-notification" />
              <span className="position-absolute top-0 start-100 translate-middle p-0-5 bg-danger border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </div>
          </NavLink>
        </NavItem>
      </Nav>
    </Collapse>
  </Navbar>;
});

MainHeader.propTypes = {
  className: PropTypes.string,
  isCollapseOpen: PropTypes.bool,
  toggleCollapse: PropTypes.func
};

MainHeader.defaultProps = {
  className: '',
  toggleCollapse: noop,
  isCollapseOpen: false
};
