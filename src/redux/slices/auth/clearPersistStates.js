import storage from 'redux-persist/lib/storage';

export const clearAllPersistedStates = async () => {
  const keys = Object.keys(localStorage); 
  const reduxPersistKeys = keys.filter(key => key.startsWith('redux-'));
  try {
    await Promise.all(reduxPersistKeys.map(key => storage.removeItem(key)));
  } catch (error) {
    console.error('Error clearing persisted states:', error);
  }
};