
// outsource dependencies
import _ from 'lodash';
import { create } from 'redux-saga-controller';
import { takeEvery, put, call, select, delay } from 'redux-saga/effects';

// local dependencies
import { silence } from '../../services';

// configure
export const modalCtrl = create({
  prefix: 'modal',
  actions: {
    // NOTE reserved
    open: 'OPEN',
    close: 'CLOSE',
    register: 'REGISTER',
    updateModal: 'UPDATE',
    unregister: 'UNREGISTER',
    // NOTE common
    load: 'LOAD',
    reject: 'REJECT',
    submit: 'SUBMIT',
    select: 'SELECT',
    resolve: 'RESOLVE',
    initialize: 'INITIALIZE',
    // NOTE for specific modal cases
    postCreated: 'POST_CREATED',
    albumEdited: 'ALBUM_EDITED',
    groupCreated: 'GROUP_CREATED',
    companyCreated: 'COMPANY_CREATED',
  },
  initial: {
    registered: [],
  },
  subscriber: function * () {
    yield takeEvery(modalCtrl.action.open.TYPE, silence, openExe);
    yield takeEvery(modalCtrl.action.close.TYPE, silence, closeExe);
    yield takeEvery(modalCtrl.action.reject.TYPE, silence, rejectExe);
    yield takeEvery(modalCtrl.action.resolve.TYPE, silence, resolveExe);
    yield takeEvery(modalCtrl.action.register.TYPE, silence, registerExe);
    yield takeEvery(modalCtrl.action.unregister.TYPE, silence, unregisterExe);
    yield takeEvery(modalCtrl.action.updateModal.TYPE, silence, updateModalExe);
  }
});
// NOTE addition helper
modalCtrl.selectModal = uid => state => _.find(_.get(modalCtrl.select(state), 'registered'), { uid }) || {};

function * resolveExe ({ payload }) {
  const uid = _.get(payload, 'uid');
  const modal = yield call(getModalExe, { uid });
  // NOTE nothing to update
  if (!modal) { return null; }

  const { disabled } = yield call(getModalExe, payload);
  // NOTE invisible disabled
  if (disabled) { return null; }
  const { onResolve } = yield select(modalCtrl.selectModal(uid));
  yield call((args) => {
    _.isFunction(onResolve) && onResolve(args);
  }, payload);
  yield put(modalCtrl.action.close({ uid }));
}

function * rejectExe ({ payload }) {
  const uid = _.get(payload, 'uid');
  const modal = yield call(getModalExe, { uid });
  // NOTE nothing to update
  if (!modal) { return null; }

  const { disabled } = yield call(getModalExe, payload);
  // NOTE invisible disabled
  if (disabled) { return null; }
  const { onReject } = yield select(modalCtrl.selectModal(uid));
  yield call((args) => {
    _.isFunction(onReject) && onReject(args);
  }, payload);
  yield put(modalCtrl.action.close({ uid }));
}

function * registerExe ({ payload }) {
  const modal = yield call(getModalExe, payload);
  // NOTE already registered
  if (modal) {
    console.warn('Modal.registration duplicate', modal);
    return null;
  }
  // NOTE add new one
  const { registered } = yield select(modalCtrl.select);
  registered.push(payload);
  // NOTE trigger view update
  yield put(modalCtrl.action.updateCtrl({ registered: registered.slice(0) }));
}

function * unregisterExe ({ payload }) {
  const { registered } = yield select(modalCtrl.select);
  // IMPORTANT identity by one field and it's "postId"
  const uid = _.get(payload, 'uid');
  // NOTE unregister in controller
  _.remove(registered, { uid });
  // NOTE trigger view update
  yield put(modalCtrl.action.updateCtrl({ registered: registered.slice(0) }));
}

function * updateModalExe ({ payload }) {
  const modal = yield call(getModalExe, payload);
  // NOTE nothing to update
  if (!modal) { return null; }
  // console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //   , '\n payload:', payload
  // );
  _.extend(modal, payload);
  // NOTE force trigger view update
  const { registered } = yield select(modalCtrl.select);
  yield put(modalCtrl.action.updateCtrl({ registered: registered.slice(0) }));
}

export function * getModalExe (identity) {
  // IMPORTANT identity by one field and it's "uid"
  const uid = _.get(identity, 'uid');
  const { registered } = yield select(modalCtrl.select);
  return _.find(registered, { uid });
}

function * closeExe ({ payload }) {
  const uid = _.get(payload, 'uid');
  // NOTE nothing to update
  if (!uid) { return null; }
  yield put(modalCtrl.action.updateModal({ uid, isOpen: false }));
  // NOTE give chance to animation
  yield delay(3e2);
  // NOTE clear modal data
  const { registered } = yield select(modalCtrl.select);
  const index = _.findIndex(registered, { uid });
  registered.splice(index, 1, { uid });
  // ¯\_(ツ)_/¯ no need view updates no action required just use link structure of JS
}

function * openExe ({ payload }) {
  const modal = yield call(getModalExe, payload);
  // NOTE nothing to update
  if (!modal) { return null; }
  yield put(modalCtrl.action.updateModal({ ...payload, isOpen: true }));
}
