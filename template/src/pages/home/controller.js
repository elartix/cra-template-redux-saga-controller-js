// outsource dependencies
import { create } from 'redux-saga-controller';
import { takeEvery, put, delay } from 'redux-saga/effects';


// local dependencies
import { silence } from '../../services';


export const homeCtrl = create({
  prefix: 'home',
  actions: {
    initialize: 'INITIALIZE',
  },
  initial: {
    disabled: false,
    initialized: false,
    testDataList: []
  },
  subscriber: function * () {
    yield takeEvery(homeCtrl.action.initialize.TYPE, silence, initializeExe);
  }
});

function * initializeExe () {
  yield delay(1e3);
  yield put(homeCtrl.action.updateCtrl({
    initialized: true,
    // eslint-disable-next-line prefer-spread
    testDataList: Array.apply(null, { length: 25 }).map(x => Math.random())
  }));
}
