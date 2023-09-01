import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import userReducer from './slices/securityUser/securityUser';
import customerReducer from './slices/customer/customer';
import siteReducer from './slices/customer/site';
import contactReducer from './slices/customer/contact';
import noteReducer from './slices/customer/note';
import machineReducer from './slices/products/machine';
import supplierReducer from './slices/products/supplier';
import licenseReducer from './slices/products/license';
import categoryReducer from './slices/products/category';
import toolReducer from './slices/products/tools';
import techparamcategoryReducer from './slices/products/machineTechParamCategory';
import machinenoteReducer from './slices/products/machineNote';
import machinestatusReducer from './slices/products/statuses';
import machinemodelReducer from './slices/products/model';
import techparamReducer from './slices/products/machineTechParam';
import machineSettingReducer from './slices/products/machineTechParamValue';
import toolInstalledReducer from './slices/products/toolInstalled';
import roleReducer from './slices/securityUser/role';
import userConfigReducer from './slices/securityUser/config';
import countReducer from './slices/dashboard/count';
import documentTypeReducer from './slices/document/documentType';
import documentCategoryReducer from './slices/document/documentCategory';
import customerDocumentReducer from './slices/document/customerDocument';
import machineDocumentReducer from './slices/document/machineDocument';
import documentReducer from './slices/document/document';
import documentFileReducer from './slices/document/documentFile';
import machineConnectionsReducer from './slices/products/machineConnections';
import documentVersionReducer from './slices/document/documentVersion';
import regionReducer from './slices/region/region';
import moduleReducer from './slices/module/module';
import drawingReducer from './slices/products/drawing';
import configReducer from './slices/config/config';
import machineServiceParamReducer from './slices/products/machineServiceParams'
import serviceRecordConfigReducer from './slices/products/serviceRecordConfig';

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
  blacklist: ['error', 'initial', 'responseMessage', 'customers']
};

export const contactPersistConfig = {
  key: 'contact',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'contacts']
};

export const sitePersistConfig = {
  key: 'site',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'sites']
};

export const notePersistConfig = {
  key: 'note',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'notes']
};

export const machinePersistConfig = {
  key: 'machine',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'machines']
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
export const techparamcategoryPersistConfig = {
  key: 'techparamcategory',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machinestatusPersistConfig = {
  key: 'machinestatus',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machinemodelPersistConfig = {
  key: 'machinemodel',
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
export const machineSettingPersistConfig = {
  key: 'machineSetting',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machineToolInstalledPersistConfig = {
  key: 'toolInstalled',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const userRolesPersistConfig = {
  key: 'role',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'userRoleTypes']
};
export const configPersistConfig = {
  key: 'config',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const userConfigPersistConfig = {
  key: 'userConfig',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const countPersistConfig = {
  key: 'count',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const documentTypePersistConfig = {
  key: 'documentType',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const documentCategoryPersistConfig = {
  key: 'documentCategory',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machineDocumentPersistConfig = {
  key: 'machineDocument',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const documentPersistConfig = {
  key: 'document',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const customerDocumentPersistConfig = {
  key: 'customerDocument',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const documentFilePersistConfig = {
  key: 'documentFile',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machineConnectionsPersistConfig={
  key: 'machineConnections',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const documentVersionPersistConfig={
  key: 'documentVersion',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const regionPersistConfig={
  key: 'region',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const modulePersistConfig={
  key: 'module',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const drawingPersistConfig={
  key: 'drawing',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const machineServiceParamPersistConfig={
  key: 'machineServiceParam',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const serviceRecordConfigPersistConfig={
  key: 'serviceRecordConfig',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}


const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  customer: persistReducer(customerPersistConfig, customerReducer),
  site: persistReducer(sitePersistConfig, siteReducer),
  contact: persistReducer(contactPersistConfig, contactReducer),
  note: persistReducer(notePersistConfig, noteReducer),
  machine: persistReducer(machinePersistConfig, machineReducer),
  supplier: persistReducer(suppplierPersistConfig,supplierReducer),
  license: persistReducer(licensePersistConfig,licenseReducer),
  category: persistReducer(categoryPersistConfig,categoryReducer),
  tool: persistReducer(toolPersistConfig,toolReducer),
  techparamcategory: persistReducer(techparamcategoryPersistConfig,techparamcategoryReducer),
  machinenote: persistReducer(techparamcategoryPersistConfig, machinenoteReducer),
  machinestatus: persistReducer(machinestatusPersistConfig, machinestatusReducer),
  machinemodel: persistReducer(machinemodelPersistConfig, machinemodelReducer),
  techparam: persistReducer(techparamPersistConfig, techparamReducer),
  machineSetting: persistReducer(machineSettingPersistConfig, machineSettingReducer),
  toolInstalled: persistReducer(machineToolInstalledPersistConfig, toolInstalledReducer),
  role: persistReducer(userRolesPersistConfig, roleReducer),
  count: persistReducer(countPersistConfig, countReducer),
  documentType: persistReducer(documentTypePersistConfig, documentTypeReducer),
  documentCategory: persistReducer(documentCategoryPersistConfig, documentCategoryReducer),
  customerDocument: persistReducer(customerDocumentPersistConfig, customerDocumentReducer),
  machineDocument: persistReducer(machineDocumentPersistConfig, machineDocumentReducer),
  document: persistReducer(documentPersistConfig, documentReducer),
  documentFile: persistReducer(documentFilePersistConfig, documentFileReducer),
  machineConnections: persistReducer(machineConnectionsPersistConfig, machineConnectionsReducer),
  documentVersion: persistReducer(documentVersionPersistConfig, documentVersionReducer),
  region: persistReducer(regionPersistConfig, regionReducer),
  module: persistReducer(modulePersistConfig, moduleReducer),
  drawing: persistReducer(drawingPersistConfig, drawingReducer),
  config: persistReducer(configPersistConfig, configReducer),
  userConfig: persistReducer(userConfigPersistConfig, userConfigReducer),
  serviceRecordConfig: persistReducer(serviceRecordConfigPersistConfig, serviceRecordConfigReducer),
  machineServiceParam: persistReducer(machineServiceParamPersistConfig, machineServiceParamReducer)

});

export default rootReducer;
