
// outsource dependencies
import React from 'react';
// import ReactDOM from 'react-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

// injections
import './styles';

// local dependencies
import AppRoot from './pages';
import { config, store } from './constants';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './registerServiceWorker';

/*ReactDOM.render(
  <Provider store={store}>
    <AppRoot />
  </Provider>,
  document.getElementById('root')
);*/

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Provider store={store}>
  <AppRoot />
</Provider>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line no-console
config('DEBUG', false) && reportWebVitals(); //reportWebVitals(console.log);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
