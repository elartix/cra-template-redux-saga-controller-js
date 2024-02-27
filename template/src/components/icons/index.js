
// outsource dependencies
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes, faEyeSlash, faEye, faEllipsisV, faEllipsisH, faCog, faEnvelope, faHome, faSearchPlus, faSearchMinus, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

// local dependencies
import * as appIcons from './app-svg-icons';

/**
 * As main Icon component we will use the font-awesome really awesome component
 * @example
 * <Icon icon={['far', icon]} {...attr} />
 */
export const Icon = FontAwesomeIcon;
/****************************************************
 *    prepared icons
 ****************************************************/

// NOTE add app icons to FA library
library.add({ ...appIcons });
library.add(
  faTrash, faTimes, faEyeSlash, faEye, faEllipsisV, faEllipsisH, faCog, faEnvelope, faHome,
  faSearchPlus, faSearchMinus, faPencilAlt
);

const FaPropTypes = {
  className: PropTypes.string,
  beat: PropTypes.bool,
  border: PropTypes.bool,
  fade: PropTypes.bool,
  flash: PropTypes.bool,
  fixedWidth: PropTypes.bool,
  inverse: PropTypes.bool,
  listItem: PropTypes.bool,
  pulse: PropTypes.bool,
  spin: PropTypes.bool,
  spinPulse: PropTypes.bool,
  spinReverse: PropTypes.bool,
  title: PropTypes.string,
  swapOpacity: PropTypes.bool,
  pull: PropTypes.oneOf(['right', 'left']),
  rotation: PropTypes.oneOf([0, 90, 180, 270]),
  flip: PropTypes.oneOf(['horizontal', 'vertical', 'both']),
  symbol: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  transform: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  mask: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]),
  icon: PropTypes.oneOfType([PropTypes.object, PropTypes.array, PropTypes.string]).isRequired,
  size: PropTypes.oneOf(['2xs', 'xs', 'sm', 'lg', 'xl', '2xl', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x'])
};
export const FasIcon = memo(({ icon, ...attr }) => <Icon icon={['fas', icon]} {...attr} />);
FasIcon.propTypes = {
  ...FaPropTypes,
};
export const FarIcon = memo(({ icon, ...attr }) => <Icon icon={['far', icon]} {...attr} />);
FarIcon.propTypes = {
  ...FaPropTypes,
};
export const FabIcon = memo(({ icon, ...attr }) => <Icon icon={['fab', icon]} {...attr} />);
FabIcon.propTypes = {
  ...FaPropTypes,
};
export const AppIcon = memo(({ icon, ...attr }) => <Icon icon={['app', icon]} {...attr} />);
AppIcon.propTypes = {
  ...FaPropTypes,
};

export const EyeIcon = memo(function EyeIcon (props) {
  return <FasIcon icon="eye" {...props} />;
});
export const EyeSlashIcon = memo(function EyeSlashIcon (props) {
  return <FasIcon icon="eye-slash" {...props} />;
});
export const TrashIcon = memo(function TrashIcon (props) {
  return <FasIcon icon="trash" {...props} />;
});
export const TimesIcon = memo(function TimesIcon (props) {
  return <FasIcon icon="times" {...props} />;
});
export const EllipsisVIcon = memo(function EllipsisVIcon (props) {
  return <FasIcon icon="ellipsis-v" {...props} />;
});
export const EllipsisHIcon = memo(function EllipsisHIcon (props) {
  return <FasIcon icon="ellipsis-h" {...props} />;
});

export const AppHomeIcon = memo(function AppHomeIcon (props) {
  return <AppIcon icon="home" {...props} />;
});
export const SearchIcon = memo(function SearchIcon (props) {
  return <AppIcon icon="nav-search" {...props} />;
});

