// outsource dependencies
import PropTypes from 'prop-types';
import React, { memo } from 'react';

// local dependencies
import logoFullApp from './logo.svg';
import logoApp from './logo-icon.svg';
import logoAppRounded from './logo-app-rounded.svg';
import circleLoading from './circle-loading.svg';
import defImg from './default-image.svg';
import logoAppFit from './logo-icon-fit.svg';
import defaultAvatar from './default-avatar.svg';
import messageFault from './message-fault-red-cross.svg';
import messageSuccess from './message-success-green-check.svg';


// eslint-disable-next-line max-len
export const DefImage = memo(function DefImage ({ src, defaultSrc, alt, defaultAlt, title, defaultTitle, defaultStyle, style, className, defaultClassName, lazy, ...attr }) {
  return <img
    alt={alt || defaultAlt}
    src={src || defaultSrc}
    title={title || defaultTitle}
    className={className || defaultClassName}
    style={Object.assign({}, defaultStyle, style)}
    onError={(event) => event.target.src = defaultSrc}
    {...attr}
  />;
});
DefImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  title: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  defaultSrc: PropTypes.string,
  defaultAlt: PropTypes.string,
  defaultTitle: PropTypes.string,
  defaultStyle: PropTypes.object,
  defaultClassName: PropTypes.string,
};
DefImage.defaultProps = {
  src: null,
  alt: '',
  title: '',
  style: {},
  className: null,
  defaultSrc: defImg,
  defaultAlt: 'image',
  defaultClassName: '',
  defaultTitle: '',
  defaultStyle: {},
};

export const CircleLoading = props => <DefImage
  defaultAlt="App"
  defaultTitle="App"
  defaultSrc={circleLoading}
  {...props}
/>;
export const LogoApp = props => <DefImage
  defaultAlt="App"
  defaultTitle="App"
  defaultSrc={logoApp}
  {...props}
/>;

export const LogoAppFit = props => <DefImage
  defaultAlt="App"
  defaultTitle="App"
  defaultSrc={logoAppFit}
  {...props}
/>;

export const LogoFullApp = props => <DefImage
  defaultAlt="App"
  defaultTitle="App"
  defaultSrc={logoFullApp}
  {...props}
/>;

export const Avatar = props => <DefImage
  defaultAlt="User"
  defaultTitle="User"
  defaultSrc={defaultAvatar}
  defaultStyle={{ borderRadius: '50%' }}
  {...props}
/>;

export const MessageSuccess = props => <DefImage
  defaultAlt="App"
  defaultTitle="App"
  defaultSrc={messageSuccess}
  {...props}
/>;

export const MessageFault = props => <DefImage
  defaultAlt="App"
  defaultTitle="App"
  defaultSrc={messageFault}
  {...props}
/>;

export const LogoAppRounded = props => <DefImage
  defaultAlt="App"
  defaultTitle="App"
  defaultSrc={logoAppRounded}
  {...props}
/>;
