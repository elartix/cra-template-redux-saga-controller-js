// outsource dependencies
import { fork } from 'redux-saga/effects';
import { reducer as form } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history';
import { reducer as toastr } from 'react-redux-toastr';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createReduxHistoryContext } from 'redux-first-history';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reducer as controllerReducer, sagas as controllerSagas, path } from 'redux-saga-controller';

// local dependencies
import { config } from './config';


// Router
const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({
  history: createBrowserHistory()
});

// NOTE Build the middleware to run our Saga
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({
  trace: true,
  name: `> ${config('NAME')} - ${config('VERSION')} - ${config('SID')}`,
  actionsDenylist: ['@CSD', 'SYSTEM_SCHEDULE', 'SOCKET_RECONNECT', 'ENCRYPTION_CHECK_FREE_KEYS']
});

// NOTE explain to ts what is it ;) to avoid type errors for --declaration
export const reducers = combineReducers({
  [path]: controllerReducer,
  // NOTE whatever what you may need
  router: routerReducer,
  toastr,
  form
});

// NOTE Create store outside of root to be able dispatch actions from anywhere!
export const store = createStore(reducers, composeEnhancers(
  applyMiddleware(routerMiddleware, sagaMiddleware)
));

// NOTE simple initialize only 'controller' sagas
// saga.run(controllerSagas);

// NOTE or controller with some thing else
sagaMiddleware.run(function * () {
  // NOTE provide to 'controller' separated saga process
  yield fork(controllerSagas);
  // NOTE whatever what you may need
  // ... another code ...
});

export const history = createReduxHistory(store);
// export const history = createBrowserHistory();
