/* eslint react/jsx-filename-extension: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import { persistStore, persistCombineReducers } from 'redux-persist';
import { PersistGate } from 'redux-persist/es/integration/react';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage/session';

import reducers from './reducers/index';
import App from './components/App';
import About from './components/About';
import ReportView from './components/ReportView';
import PDFApp from './components/PDFApp';
import TopNavigation from './components/navigation/TopNavigation';

import './index.css';

const history = createHistory();

const config = {
  key: 'root',
  storage,
};

const rootReducer = persistCombineReducers(config, {
  ...reducers,
  router: routerReducer,
});

const middleware = applyMiddleware(
  routerMiddleware(history),
  thunk,
);

const store = createStore(
  rootReducer,
  middleware,
);

const persistor = persistStore(store);

ReactDOM.render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          <TopNavigation />
          <Route exact path="/" component={App} />
          <Route path="/report" component={ReportView} />
          <Route path="/about" component={About} />
          <Route path="/pdf/:id?" component={PDFApp} />
        </div>
      </ConnectedRouter>
    </Provider>
  </PersistGate>,
  document.getElementById('root'),
);
