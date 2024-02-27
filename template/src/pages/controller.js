
// outsource dependencies
import _ from 'lodash';
import { toastr } from 'react-redux-toastr';
import { create } from 'redux-saga-controller';
import { takeLeading, takeEvery, put, call, select, delay, race, fork } from 'redux-saga/effects';

// local dependencies
import staticSaga from './static.saga';
import * as ROUTES from '../constants';
import { store, USER_STATE } from '../constants';
import { silence, onAuthFailApplicationAction, instanceAPI } from '../services';

onAuthFailApplicationAction(() => store.dispatch(appRootCtrl.action.signOut()));

export const appRootCtrl = create({
  prefix: 'app',
  actions: {
    signOut: 'SIGN_OUT',
    appWarning: 'WARNING',
    initialize: 'INITIALIZE',
    authorized: 'AUTHORIZED',
    unauthorized: 'UNAUTHORIZED',
    getLanguages: 'GET_LANGUAGES',
    getCountries: 'GET_COUNTRIES',
  },
  initial: {
    google: false,                  // is enabled support of connection app with "Google" (social-google.saga.js)
    initialized: false,             // prevent redirect from page and show instead current page and it behavior - global preloader
    health: true,                   // prevent redirect from page and show instead current page and it behavior - maintenance page
    user: null,                     // logged user information
    languages: [],                  // available languages as static app data
    countries: [],                  // available countries as static app data
  },
  subscriber: function * () {
    yield takeEvery(appRootCtrl.action.signOut.TYPE, silence, signOutExe);
    yield takeEvery(appRootCtrl.action.initialize.TYPE, silence, initializeExe);
    yield takeEvery(appRootCtrl.action.authorized.TYPE, silence, authorizedExe);
    yield takeLeading(appRootCtrl.action.appWarning.TYPE, silence, appWarningExe);

    // connect nested sagas
    yield fork(staticSaga);
    // yield fork(googleSaga);
  }
});

function * initializeExe () {
// NOTE check health of API
  const [healthResponse] = yield race([
    call(silence, instanceAPI.checkAPIHealth),
    // NOTE limit checking
    delay(3e4),
  ]);
  const health = _.get(healthResponse, 'status') === 'UP';
  yield put(appRootCtrl.action.updateCtrl({ health }));
  if (!health) {
    // NOTE try again another time
    yield delay(3e4);
    return yield put(appRootCtrl.action.initialize());
  }
  // NOTE trying to restore user
  const [self] = yield race([
    call(silence, instanceAPI.restoreUserFromStore),
    // NOTE limit restoring
    delay(5e3),
  ]);
  // console.log('%c initializeExe', 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n type:', type
  //   , '\n self:', self
  //   , '\n health:', health
  //   , '\n payload:', payload
  // );
  // NOTE in case successfully restored self
  if (self) {
    yield put(appRootCtrl.action.updateCtrl({ user: self }));
    // NOTE fire synthetic action to notify app
    yield put(appRootCtrl.action.authorized(self));
  }
  // NOTE initialization done
  yield put(appRootCtrl.action.updateCtrl({ initialized: true }));
}

export function * signOutExe () {
  const { user: self } = yield select(appRootCtrl.select);
  // console.log('%c signOutExe ', 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n type:', type
  //   , '\n self:', self
  //   , '\n payload:', payload
  // );
  // NOTE sign out in real we do not need to await answer at all
  yield race([delay(1e3), call(silence, instanceAPI.signOut)]);
  // NOTE remove logged user
  yield put(appRootCtrl.action.updateCtrl({ user: null }));
  // NOTE fire synthetic action to notify app
  yield put(appRootCtrl.action.unauthorized(self));
}

function * authorizedExe () {
  const { user: self } = yield select(appRootCtrl.select);

  // console.log('%c authorizedExe ', 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n type:', type
  //   , '\n self:', self
  //   , '\n payload:', payload
  //   , '\n sp:', USER_STATE.CREATED === _.get(self, 'userState')
  // );
  if ((USER_STATE.CREATED === _.get(self, 'userState')) || USER_STATE.PENDING === _.get(self, 'userState')) {
    yield delay(3e2);
    yield call(ROUTES.SIGN_UP.REPLACE);
  }
}

export function * appWarningExe ({ payload }) {
  const title = _.get(payload, 'title', 'System');
  const content = _.isString(payload) ? payload : _.get(payload, 'content', 'Something weird happens');

  yield call(toastr.warning, title, content);
}
