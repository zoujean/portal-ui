// @flow
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { apiMiddleware } from 'redux-api-middleware';
import reducers from './reducers';

type TSetupStoreArgs = {
  persistConfig: Object,
};
type TSetupStore = (args: TSetupStoreArgs) => Object;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const setupStore: TSetupStore = ({ persistConfig = {} } = {}) => {
  console.log('storage: ', storage);
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
    debug: true,
    ...persistConfig,
  };
  console.log('config: ', config);
  const store = createStore(
    persistCombineReducers(config, reducers),
    undefined,
    composeEnhancers(applyMiddleware(thunk, apiMiddleware)),
  );

  const persistor = persistStore(store);

  return { store, persistor };
};

export default setupStore;
