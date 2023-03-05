import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import assetReducer from './slices/asset';
import userReducer from './slices/user';
import departmentReducer from './slices/department';
import customerReducer from './slices/customer';
import siteReducer from './slices/site';
import contactReducer from './slices/contact';
import noteReducer from './slices/note';
import machineReducer from './slices/machine';
import supplierReducer from './slices/supplier';
import licenseReducer from './slices/license';
import categoryReducer from './slices/category';
import toolReducer from './slices/tools';
import techparamReducer from './slices/tech-param';
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

export const contactPersistConfig = {
  key: 'contact',
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

export const notePersistConfig = {
  key: 'note',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const machinePersistConfig = {
  key: 'machine',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const suppplierPersistConfig = {
  key: 'supplier',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const licensePersistConfig = {
  key: 'license',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const categoryPersistConfig = {
  key: 'category',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const toolPersistConfig = {
  key: 'tool',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const techparamPersistConfig = {
  key: 'techparam',
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
  contact: persistReducer(contactPersistConfig, contactReducer),
  note: persistReducer(notePersistConfig, noteReducer),
  machine: persistReducer(machinePersistConfig, machineReducer),
  supplier: persistReducer(suppplierPersistConfig,supplierReducer),
  license: persistReducer(licensePersistConfig,licenseReducer),
  category: persistReducer(categoryPersistConfig,categoryReducer),
  tool: persistReducer(toolPersistConfig,toolReducer),
  techparam: persistReducer(techparamPersistConfig,techparamReducer),
});

export default rootReducer;
