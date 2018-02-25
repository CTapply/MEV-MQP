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
import App from './components/visualization/App';
import Login from './components/portal/Login';
import About from './components/portal/About';
import Dashboard from './components/portal/Dashboard';
import ReportList from './components/reports/ReportList';
import NarrativeAnnotator from './components/editor/NarrativeAnnotator';
import TopNavigation from './components/TopNavigation';
import CaseSummary from './components/cases/CaseSummary';

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
          {/* <TopNavigation showFilters={test}/> */}
          <Route exact path="/" component={(props) => {
              return (
                <div>
                  <TopNavigation showFilters={false}/>
                  <Login { ...props } />
                </div>
              );
            }}
          />
          <Route path="/visualization" component={(props) => {
              return (
                <div>
                  <TopNavigation showFilters={true}/>
                  <App { ...props } />
                </div>
              );
            }}
          />
          <Route path="/report" component={(props) => {
              return (
                <div>
                  <TopNavigation showFilters={true}/>
                  <ReportList { ...props } />
                </div>
              );
            }}
          />
          <Route path="/about" component={(props) => {
              return (
                <div>
                  <TopNavigation showFilters={false}/>
                  <About { ...props } />
                </div>
              );
            }}
          />
          <Route path="/dashboard" component={(props) => {
              return (
                <div>
                  <TopNavigation showFilters={false}/>
                  <Dashboard { ...props } />
                </div>
              );
            }}
          />
          <Route path="/pdf/:id?" component={(props) => {
              return (
                <div>
                  <TopNavigation showFilters={false}/>
                  <NarrativeAnnotator { ...props } />
                </div>
              );
            }}
          />
          <Route path="/case/:id?" component={(props) => {
              return (
                <div>
                  <TopNavigation showFilters={false}/>
                  <CaseSummary { ...props } />
                </div>
              );
            }}
          />
        </div>
      </ConnectedRouter>
    </Provider>
  </PersistGate>,
  document.getElementById('root'),
);
