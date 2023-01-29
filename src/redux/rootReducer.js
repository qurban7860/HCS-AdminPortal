import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import assetReducer from './slices/asset';
import userReducer from './slices/user';
import departmentReducer from './slices/department';
import customerReducer from './slices/customer';
import siteReducer from './slices/site'
// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const assetPersistConfig = {
  key: 'asset',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const departmentPersistConfig = {
  key: 'department',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['departments'],

};

export const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const customerPersistConfig = {
  key: 'customer',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const sitePersistConfig = {
  key: 'site',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  asset: persistReducer(assetPersistConfig, assetReducer),
  department: persistReducer(departmentPersistConfig, departmentReducer),
  customer: persistReducer(customerPersistConfig, customerReducer),
  site: persistReducer(sitePersistConfig, siteReducer),

});

export default rootReducer;
