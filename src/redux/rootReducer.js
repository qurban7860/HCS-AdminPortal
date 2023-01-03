import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import assetReducer from './slices/asset';
import userReducer from './slices/user';

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

export const assetPersistConfig = {
  key: 'asset',
  storage,
  keyPrefix: 'redux-',
};

export const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
};
const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  product: persistReducer(productPersistConfig, productReducer),
  user: persistReducer(userPersistConfig, userReducer),
  asset: persistReducer(assetPersistConfig, assetReducer),
});

export default rootReducer;
