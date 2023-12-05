import storage from 'redux-persist/lib/storage';

export const clearAllPersistedStates = async () => {
  try {
      const keys = Object.keys(localStorage); 
      const reduxPersistKeys = keys.filter(  key => !(key === 'remember' || key === 'UserEmail' || key === 'UserPassword')  );
    await Promise.all(reduxPersistKeys.map(key => storage.removeItem(key)));
  } catch (error) {
    console.error('Error clearing persisted states:', error);
  }
};