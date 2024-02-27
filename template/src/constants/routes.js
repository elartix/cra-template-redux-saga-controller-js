// local dependencies
import { history } from './store';
// eslint-disable-next-line no-unused-vars
import { Route, isOneOf } from '../services';

// NOTE Allow [Route].PUSH/REPLACE
Route.setHistory(history);
const defineRoute = (...args) => Route.create(...args);

export const ENTRY_POINT = '/';

// public
export const HOME = defineRoute(ENTRY_POINT);
export const NO_MATCH = defineRoute(`${HOME.ROUTE}404`);
export const SIGN_IN = defineRoute(`${HOME.ROUTE}sign-in`);
export const SIGN_UP = defineRoute(`${HOME.ROUTE}sign-up`);
