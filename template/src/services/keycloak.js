// outsource dependencies
import KeycloakJS from 'keycloak-js';
import { config } from '../constants';

// local dependencies

const keycloakInstance = new KeycloakJS({
  url: config('KEYCLOAK_URL', null), //auth only for <= keycloak v17
  realm: config('KEYCLOAK_REALM', null),
  clientId: config('KEYCLOAK_CLIENT_ID', null),
});

/**
 *
 * @typedef KeycloakInitOptions
 * @type {object}
 * @property {string} onLoad -
 * @property {string} pkceMethod -
 * @property {boolean} enableLogging
 * @property {boolean} checkLoginIframe
 * @property {string} silentCheckSsoRedirectUri
 *
 * @param {KeycloakInitOptions} initOptions

 * @example
 * {
 *   onLoad: 'check-sso',
 *   pkceMethod: 'S256',
 *   enableLogging: true,
 *   checkLoginIframe: false,
 *   silentCheckSsoRedirectUri: `${window.location.origin}/silent-sso.html`
 * }
 * @constructor
 * @returns {Promise<any>}
 */
const KeycloakClientService = (initOptions) => {
  return new Promise((resolve, reject) => {
    keycloakInstance.init(initOptions).then(async authorized => {
      // passing authorization status: true or false to app service for later use
      resolve({ authorized, keycloakInstance });
    }).catch(error => {
      reject(error);
    });
  });
};

export { keycloakInstance, KeycloakClientService };

