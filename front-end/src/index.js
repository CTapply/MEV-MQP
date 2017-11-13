/* eslint react/jsx-filename-extension: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

/* <!-------------- CSS File Imports! --------------!> */
import './index.css';


import reducers from './reducers/index';
//import App from './components/App';
import ReportView from './components/ReportView';

const store = createStore(reducers, applyMiddleware(thunk));

ReactDOM.render(
  <Provider store={store}>
    <ReportView />
  </Provider>,
  document.getElementById('root'),
);
