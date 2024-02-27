// outsource dependencies
import qs from 'qs';
import _ from 'lodash';
import axios from 'axios';

// local dependencies
import { config } from '../constants';
import { keycloakInstance } from './keycloak';
import { AccessTokenStorage, RefreshTokeStorage } from './storage';

const AUTH_HEADER = 'Authorization';
const API_PATH = config('SERVICE_URL', null);
const KEYCLOAK_FLOW = Boolean(config('KEYCLOAK_URL', null))
  && Boolean(config('KEYCLOAK_REALM', null))
  && Boolean(config('KEYCLOAK_CLIENT_ID', null));

/**
 *
 * @returns {string} `Bearer ${*}`
 */
const getAuthHeader = () => KEYCLOAK_FLOW ? keycloakInstance.token : `Bearer ${AccessTokenStorage.get()}`;

/**
 * Expected session schema
 * @typedef Session
 * @type {object}
 * @property {string} accessToken - access token string.
 * @property {string} refreshToken - refresh token string.
 * @property {number} responseCode
 * @property {string} responseMessage
 *
 * Update session in storage
 * @param {AxiosResponse|Session?} [session=null]
 */
const updateStoredSession = session => {
  if (_.get(session, 'accessToken', null)) {
    AccessTokenStorage.set(session.accessToken);
    RefreshTokeStorage.set(session.refreshToken);
  } else {
    AccessTokenStorage.remove();
    RefreshTokeStorage.remove();
  }
};

/**
 * common way to know session state
 *
 * @return {Boolean}
 */
const hasStoredSession = () => KEYCLOAK_FLOW
  ? keycloakInstance.token
  : Boolean(AccessTokenStorage.get());

/**
 * override query serializer to define array Format as API needed
 *
 * @param {Object} options
 *
 * @return {String}
 */
const paramsSerializer = options => qs.stringify(options, { arrayFormat: 'repeat', encode: false });

/**
 * prepare error
 *
 * @param {Object} error
 *
 * @return {Promise}
 */
const prepareError = error => {
  error = {
    // axiosError: error,
    path: _.get(error, 'config.url', null),
    response: _.get(error, 'response.data', null),
    status: _.get(error, 'response.status', null),
    requestData: _.get(error, 'config.data', null),
    method: _.get(error, 'config.method', 'CODE_NULL'),
    requestParams: _.get(error, 'config.params', null),
    errorCode: _.get(error, 'response.data.errorCode', null),
  };
  if (config('DEBUG', false)) {
    console.warn('%c Interceptor: ', 'background: #EC1B24; color: #fff; font-size: 14px;', error);
  }
  const message = getMessage([error.errorCode], error.response ? 'CODE_NULL' : 'CROSS_DOMAIN_REQUEST');
  return Promise.reject({ ...error.response, message });
};

/*******************************************************
 *              Predefined calls
 *******************************************************/
/**
 * Way to notify app about unexpected losing of session
 * @param fn
 *
 * @return {*}
 */
const onAuthFailApplicationAction = fn => authFail = fn;
let authFail = error => console.warn('authorization is fail. Expected to override this action');

/**
 * Make Api Instance

 * @typedef {Object} ExtendedApi
 * @property {func} signIn execute signIn method based on instance api
 * @property {func} signUp execute signUp method based on instance api
 * @property {func} getSelf execute getSelf method based on instance api
 * @property {func} signOut execute signOut method based on instance api
 * @property {func} setupSession
 * @property {func} checkAPIHealth checking API health state
 * @property {func} hasStoredSession
 * @property {func} restoreUserFromStore
 * @property {func} restoreSessionFromStore
 *
 * @typedef {AxiosInstance & ExtendedApi} ExtendedInstanceApi
 *
 * @param options
 *
 * @returns ExtendedInstanceApi
 */
const makeApiInstance = (options) => {
  /**
   * Axios instance prepared ``for app with authorization
   * contain logic for working with authorization and 401 interceptor
   */
  const API = axios.create(options);

  /**
   * provide correct way to restore session
   */
  const restoreSessionFromStore = () => !hasStoredSession()
    ? (API.defaults.headers[AUTH_HEADER] = void(0))
    : (API.defaults.headers[AUTH_HEADER] = getAuthHeader());

  /**
   * provide correct way to setup authorization session
   * @function
   *
   * @param {AxiosResponse|Session?} [session=null] to kill session within instanceAPI
   */
  const setupSession = session => {
    updateStoredSession(session);
    restoreSessionFromStore();
  };

  /**
   * setup interceptors
   * sync check to known is user logged in
   * NOTE to known more {@link https://gist.github.com/mkjiau/650013a99c341c9f23ca00ccb213db1c | axios-interceptors-refresh-token}
   */
  API.interceptors.response.use(
    response => _.get(response, 'data', null),
    error => ((
      hasStoredSession()
      && error.request.status === 401
      // NOTE support request may get 401 (JAVA Spring is fucking genius ...) we must skip restoring for that case
      && !/sign-out|\/oauth\/token/.test(error.config.url)
    ) ? handleRefreshSession(error) : prepareError(error))
  );

  /**
   * Request new session
   * @function
   *
   * @return {Promise}
   */
  const requestNewSession = () => {
    return new Promise((resolve, reject) => {
      if (KEYCLOAK_FLOW) {
        keycloakInstance.updateToken(10)
          .then(refreshed => resolve({
            accessToken: keycloakInstance.token,
            refreshToken: keycloakInstance.refreshToken
          })).catch(reject);
      } else {
        API.post('/auth/token/refresh', { refreshToken: RefreshTokeStorage.get() })
          .then(session => resolve(session)).catch(reject);
      }
    });
  };

  /**
   * local variables to correctness refreshing session process
   */
  let isRefreshing = false, stuckRequests = [];
  /**
   * Store all requests with 401 refresh session and try send request again
   * @function
   *
   * @param {Object} error
   *
   * @return {Promise}
   */
  const handleRefreshSession = error => {
    const { config } = error;
    if (!isRefreshing) {
      isRefreshing = true;
      API.defaults.headers[AUTH_HEADER] = void(0);
      // TODO refresh token flow
      requestNewSession
        .then(session => {
          setupSession(session);
          // NOTE resend all
          stuckRequests.map(({ config, resolve, reject }) => {
          // NOTE setup new authentication header in old request config
            config.headers[AUTH_HEADER] = getAuthHeader();
            API(config).then(resolve).catch(reject);
            // NOTE "array-callback-return"
            return null;
          });
          // NOTE start new stuck
          stuckRequests = [];
          isRefreshing = false;
        })
        .catch(() => {
        // NOTE reject all
          stuckRequests.map(({ error, reject }) => reject(error));
          // NOTE provide ability to handle this situation
          authFail(error);
          // NOTE start new stuck
          stuckRequests = [];
          isRefreshing = false;
        });
    }
    // NOTE determine first trying to restore session
    if (!config.wasTryingToRestore) {
      return new Promise((resolve, reject) => {
        config.wasTryingToRestore = true;
        stuckRequests.push({ config, error, resolve, reject });
      });
    }
    return prepareError(error);
  };

  /**
   * Checking API health state
   * @function
   *
   * @returns {AxiosPromise}
   */
  const checkAPIHealth = () => Promise.resolve({ status: 'UP' }); //API({ url: '/actuator/health', method: 'GET' }); //
  /**
   * Getting logged user
   * @function
   *
   * @returns {AxiosPromise}
   */
  const getSelf = () => API({ url: '/users/self', method: 'GET' });
  /**
   * Sign In flow using regular email
   * @function
   *
   * @param payload
   *
   * @returns {Promise<AxiosResponse<any>>}
   */
  const signIn = payload => API({
    url: '/auth/token',
    method: 'POST',
    data: {
      username: _.get(payload, 'username'),
      password: _.get(payload, 'password'),
    }
  }).then(session => {
    setupSession(session);
    return getSelf();
  });

  /**
   * Sign up flow using regular email
   * @function
   *
   * @param payload
   *
   * @returns {AxiosPromise}
   */
  const signUp = payload => {
    const baseUrl = '/users/register';
    const userRole = _.get(payload, 'userRole');
    const url = _.isEmpty(userRole) ? baseUrl : `${baseUrl}/${userRole}`;
    return API({
      url,
      method: 'POST',
      data: {
        username: _.get(payload, 'username'),
        password: _.get(payload, 'password'),
      }
    });
  };

  /**
   * Sign Out flow
   * @param {string?} redirectUri Keycloak - Specifies the uri to redirect to after logout.
   *
   * @function
   */
  const signOut = (redirectUri= undefined) => KEYCLOAK_FLOW
    ? (() => {
      keycloakInstance.logout({ redirectUri });
      keycloakInstance.clearToken();
      setupSession(null);
    })()
    : API({ url: '/auth/logout', method: 'POST' })
      .then(response => {
        setupSession(null);
        return response;
      })
      .catch(() => {
        setupSession(null);
      });

  /**
   * Restoring previously logged in user from local storage if it was
   * @function
   *
   * @returns {AxiosPromise?}
   */
  const restoreUserFromStore = () => {
    if (hasStoredSession()) {
      restoreSessionFromStore();
      return getSelf();
    }
    setupSession(null);
  };

  return Object.assign(API, {
    signIn,
    signUp,
    getSelf,
    signOut,
    setupSession,
    checkAPIHealth,
    hasStoredSession,
    restoreUserFromStore,
    restoreSessionFromStore,
  });
};

/******************************************************************
 *           format of ERRORS
 ******************************************************************/
/**
 * try to find explanation of error in specification
 *
 * @param {String[]|String} errors
 * @param {String} [defMessage=null]
 */
function getMessage (errors, defMessage) {
  // NOTE check and setup default message
  if (!_.isString(defMessage)) {
    defMessage = getMessage('UNKNOWN_ERROR', 'Some thing went wrong ...');
  } else {
    defMessage = ERROR_MESSAGE[defMessage] ? ERROR_MESSAGE[defMessage] : defMessage;
  }
  // NOTE try to get message from specification
  let message = '';
  if (_.isArray(errors)) {
    message = errors.map(e => getMessage(e, defMessage)).join(', ');
  } else if (errors) {
    message = ERROR_MESSAGE[errors];
  }
  return message || defMessage;
}

const ERROR_MESSAGE = {
  CODE_NULL: 'Something went wrong ...',
  NESTED_EXCEPTION: 'Some thing went wrong ...',
  UNKNOWN_ERROR: 'Some thing went wrong ...',
  ACCESS_DENIED: 'Authentication required',
  CROSS_DOMAIN_REQUEST: 'Cross domain request not allowed !',
  FORBIDDEN: 'Access is denied."',
  404: '404: Resources not found',
  NOT_IMPLEMENTED: 'Functionality currently unavailable',
  USER_ALREADY_EXISTS: 'User with such login already exist. Please use Sign In form to continue.',
};

const instanceAPI = makeApiInstance({
  paramsSerializer,
  baseURL: API_PATH,
  withCredentials: false,
  headers: {
    // 'Cache-Control': 'no-cache', // not allowed by CORS
    'Content-Type': 'application/json',
  },
});

export {
  instanceAPI,
  ERROR_MESSAGE,
  onAuthFailApplicationAction
};
