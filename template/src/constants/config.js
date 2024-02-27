// edit own instance of env variables
import _ from 'lodash';


export const environmentConfig = {
  BASE_URL: process.env.REACT_APP_BASE_URL,
  SID: varString(process.env.REACT_APP_SID),
  NAME: varString(process.env.REACT_APP_NAME),
  DEBUG: varBoolean(process.env.REACT_APP_DEBUG),
  SERVICE_URL: process.env.REACT_APP_SERVICE_URL,
  WEBSITE_URL: process.env.REACT_APP_WEBSITE_URL,
  VERSION: varString(process.env.REACT_APP_VERSION),
  PRODUCTION: varBoolean(process.env.REACT_APP_PRODUCTION),
  MAX_UPLOAD_SIZE: Number(process.env.REACT_APP_MAX_UPLOAD_SIZE),

  DATE_FORMAT: process.env.REACT_APP_DATE_FORMAT,
  TIME_FORMAT: varString(process.env.REACT_APP_TIME_FORMAT),
  DATE_TIME_FORMAT: `${varString(process.env.REACT_APP_DATE_FORMAT)} ${varString(process.env.REACT_APP_TIME_FORMAT)}`,

  // Keycloak
  KEYCLOAK_URL: varString(process.env.REACT_APP_KEYCLOAK_URL),
  KEYCLOAK_REALM: varString(process.env.REACT_APP_KEYCLOAK_REALM),
  KEYCLOAK_CLIENT_ID: varString(process.env.REACT_APP_KEYCLOAK_CLIENT_ID),
  KEYCLOAK_ON_LOAD: varString(process.env.REACT_APP_KEYCLOAK_ON_LOAD),

  // s3
  CLOUD_AWS_BUCKET: varString(process.env.REACT_APP_CLOUD_AWS_BUCKET),

  // NOTE third party auth Google
  GOOGLE_SCOPE: varString(process.env.REACT_APP_GOOGLE_SCOPE),
  GOOGLE_CLIENT_ID: varString(process.env.REACT_APP_GOOGLE_CLIENT_ID),
  GOOGLE_AUTH_REDIRECT: varString(process.env.REACT_APP_GOOGLE_AUTH_REDIRECT),
  // NOTE third party auth Facebook
  FACEBOOK_SCOPE: varString(process.env.REACT_APP_FACEBOOK_SCOPE),
  FACEBOOK_API_KEY: varString(process.env.REACT_APP_FACEBOOK_API_KEY),
  FACEBOOK_AUTH_REDIRECT: varString(process.env.REACT_APP_FACEBOOK_AUTH_REDIRECT),
};

// Log for PROD
environmentConfig.PRODUCTION && console.info(`%c Version: ${environmentConfig.VERSION} `
  , 'background: #3f68b1; color: #fff; font-weight: bolder; font-size: 14px;');

// ON debug mode for production using url params
environmentConfig.DEBUG = environmentConfig.DEBUG || /show_DEBUG/.test(window.location.href);

environmentConfig.DEBUG
&& console.info('%c CONFIG ', 'background: #EC1B24; color: #000; font-weight: bolder; font-size: 30px;'
  , '\n All ENV:', process.env
  , '\n environmentConfig:', environmentConfig
);

/**
 * config is a function which allow to define defaults
 * @param {String} prop
 * @param {*} defaults
 */
export const config = (prop, defaults) => _.get(environmentConfig, prop, defaults);
config.all = () => Object.assign({}, environmentConfig);

/**
 *
 * @param {string} value
 * @returns {boolean}
 */
function varBoolean (value) {
  return /^(true|1)$/i.test(value);
}
/**
 *
 * @param {string} value
 * @returns {string[]|undefined}
 */
// eslint-disable-next-line no-unused-vars
function varArray (value) {
  return value ? value.split(',') : void 0;
}
/**
 *
 * @param {string} value
 * @returns {string|undefined}
 */
function varString (value) {
  return /^(null|undefined)$/i.test(value) ? void 0 : value;
}
