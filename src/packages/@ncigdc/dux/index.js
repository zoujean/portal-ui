// @flow
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { apiMiddleware } from 'redux-api-middleware';
import reducers from './reducers';

type TSetupStoreArgs = {
  persistConfig: Object,
};
type TSetupStore = (args: TSetupStoreArgs) => Object;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const setupStore: TSetupStore = ({ persistConfig = {} } = {}) => {
  const config = {
    key: 'reducers',
    storage,
    whitelist: [
      'cart',
      'tableColumns',
      'customFacets',
      'sets',
      'analysis',
      'bannerNotification',
      'auth',
    ],
    ...persistConfig,
  };
  const store = createStore(
    persistCombineReducers(config, reducers),
    {},
    composeEnhancers(applyMiddleware(thunk, apiMiddleware)),
  );

  const persistor = persistStore(store);

  return { store, persistor };
};

export default setupStore;
