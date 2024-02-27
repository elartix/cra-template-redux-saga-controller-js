// outsource dependencies
import { create } from 'redux-saga-controller';
import { takeEvery, put, delay, select } from 'redux-saga/effects';


// local dependencies
import { silence } from '../../../services';


export const mainLayoutCtrl = create({
  prefix: 'main-layout',
  actions: {
    initialize: 'INITIALIZE',
    openHeaderCollapse: 'OPEN_HEADER_COLLAPSE',
    closeHeaderCollapse: 'CLOSE_HEADER_COLLAPSE',
    toggleHeaderCollapse: 'TOGGLE_HEADER_COLLAPSE'
  },
  initial: {
    disabled: false,
    initialized: false,
    lastOpened: null,
    showSearch: false,
    isCollapseOpen: false,
  },
  subscriber: function * () {
    yield takeEvery(mainLayoutCtrl.action.initialize.TYPE, silence, initializeExe);
    yield takeEvery(mainLayoutCtrl.action.openHeaderCollapse.TYPE, silence, openHeaderCollapseSaga);
    yield takeEvery(mainLayoutCtrl.action.closeHeaderCollapse.TYPE, silence, closeHeaderCollapseSaga);
    yield takeEvery(mainLayoutCtrl.action.toggleHeaderCollapse.TYPE, silence, toggleHeaderCollapseSaga);
  }
});

function * initializeExe () {
  yield delay(1e3);
  yield put(mainLayoutCtrl.action.updateCtrl({
    initialized: true,
  }));
}

function * toggleHeaderCollapseSaga () {
  const { isCollapseOpen } = yield select(mainLayoutCtrl.select);

  yield put(mainLayoutCtrl.action.updateCtrl({ isCollapseOpen: !isCollapseOpen }));
}

function * openHeaderCollapseSaga () {
  yield put(mainLayoutCtrl.action.updateCtrl({ isCollapseOpen: true }));
}

function * closeHeaderCollapseSaga () {
  yield put(mainLayoutCtrl.action.updateCtrl({ isCollapseOpen: false }));
}
