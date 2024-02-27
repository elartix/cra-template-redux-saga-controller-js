
// outsource dependencies
import _ from 'lodash';
import { takeLeading, put, call, select } from 'redux-saga/effects';


// local dependencies
import { silence } from '../services';
import { appRootCtrl } from './controller';
import { getCountries } from '../constants/countries';
import { getLanguages } from '../constants/languages';

// configure
export default function * () {
  // NOTE listen
  yield takeLeading(appRootCtrl.action.getCountries.TYPE, silence, getCountriesExe);
  yield takeLeading(appRootCtrl.action.getCountries.TYPE, silence, getLanguagesExe);
}

function * getCountriesExe () {
  const { countries: current } = yield select(appRootCtrl.select);
  if (_.size(current)) { return null; }
  // const { content: countries } = yield call(instanceAPI, {
  //   url: '/country',
  //   method: 'POST',
  //   data: { name: '' },
  //   params: { page: 0, size: 512 },
  // });
  const countries = yield call(silence, getCountries);
  yield put(appRootCtrl.action.updateCtrl({ countries }));
}

function * getLanguagesExe () {
  const { languages: current } = yield select(appRootCtrl.select);
  if (_.size(current)) { return null; }
  const languages = yield call(silence, getLanguages);
  yield put(appRootCtrl.action.updateCtrl({ languages }));
}
