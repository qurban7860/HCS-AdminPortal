import PropTypes from 'prop-types';
import storage from 'redux-persist/lib/storage';

import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { CONFIG } from '../config-global';
// utils
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
//
import { isValidToken, setSession } from './utils';



// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  // resetTokenTime: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL': {
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        // resetTokenTime: action.payload.resetTokenTime, // keeps track to avoid repeating the request
      };
    }
    case 'LOGIN': {
      const { user, userId } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
        userId,
      };
    }
    case 'REGISTER': {
      const { user } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        // resetTokenTime: null, // reset the timeout ID when logging out
      };
    }
    default: {
      return state;
    }
  }
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const storageAvailable = useMemo(() => localStorageAvailable(), []);
  
  const initialize = useCallback(async () => {

    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const user = {
          email: localStorage.getItem('email'),
          displayName: localStorage.getItem('name'),
        };
        const userId = localStorage.getItem('userId');

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
            userId,
            // resetTokenTime, // added the timeout ID to the payload
           },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
            // resetTokenTime: null, // reset the timeout ID when not authenticated
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          isAuthenticated: false,
          user: null,
          // resetTokenTime: null,
        },
      });
    }
  }, [storageAvailable, dispatch]);

  useEffect(() => {
    initialize();
  }, [initialize]);  

  // CONFIGURATIONS
  async function getConfigs(){
    const configsResponse = await axios.get(`${CONFIG.SERVER_URL}configs`, {  params: { isActive: true, isArchived: false } });
    if(configsResponse && Array.isArray(configsResponse.data) && configsResponse.data.length>0 ) {
      const configs = configsResponse.data.map((c)=>({name:c.name, type:c.type, value:c.value, notes:c.notes}));
      localStorage.setItem("configurations",JSON.stringify(configs));
    }
  }

  // LOGIN
  const login = useCallback(async (uEmail, uPassword) => {
    const response = await axios.post(`${CONFIG.SERVER_URL}security/getToken`, { email: uEmail, password : uPassword, })
    if (response.data.multiFactorAuthentication){
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("MFA", true);
    } else{
      const { accessToken, user, userId } = response.data;
      const rolesArrayString = JSON.stringify(user.roles);
      localStorage.setItem('email', user.email);
      localStorage.setItem('name', user.displayName);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRoles', rolesArrayString);
      setSession(accessToken);
      await getConfigs();
      dispatch({
        type: 'LOGIN',
        payload: { user, userId },
      });
    }
  }, []);

  // MULTI FACTOR CODE
  const muliFactorAuthentication = useCallback(async (code, userID) => {
    const response = await axios.post(`${CONFIG.SERVER_URL}security/multifactorverifyCode`, {code, userID})
      const { accessToken, user, userId } = response.data;
      const rolesArrayString = JSON.stringify(user.roles);
      localStorage.setItem('email', user.email);
      localStorage.setItem('name', user.displayName);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRoles', rolesArrayString);
      setSession(accessToken);
      await getConfigs();
      dispatch({
        type: 'LOGIN',
        payload: { user, userId },
      });
  }, []);


  // REGISTER
  const register = useCallback(async (firstName, lastName, email, password) => {
    const response = await axios.post(`${CONFIG.SERVER_URL}users/signup`, {
      firstName,
      lastName,
      email,
      password,
    });
    const { accessToken, user } = response.data;
    localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // Clear All persisted data and remove Items from localStorage
  const clearAllPersistedStates = useCallback( async () => {
    try {
        setSession(null);
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRoles');
        localStorage.removeItem('accessToken');
        localStorage.removeItem("configurations");
        dispatch({
          type: 'LOGOUT',
        });
        const keys = Object.keys(localStorage); 
        const reduxPersistKeys = keys.filter(  key => !(key === 'remember' || key === 'UserEmail' || key === 'UserPassword')  );
      await Promise.all(reduxPersistKeys.map(key => storage.removeItem(key)));
    } catch (error) {
      console.error('Error clearing persisted states:', error);
    }
  },[]);

  // LOGOUT
  const logout = useCallback( async () => {
    const userId  = localStorage.getItem("userId")
    await dispatch(clearAllPersistedStates());
    await axios.post(`${CONFIG.SERVER_URL}security/logout/${userId}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

// Memoization
  const memoizedValue = useMemo(
      () => ({
        isInitialized: state.isInitialized,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        userId: state.userId,
        method: 'jwt',
        login,
        register,
        logout,
        clearAllPersistedStates,
        muliFactorAuthentication
      }),
    [state.isAuthenticated, state.isInitialized, state.user, state.userId, login, logout, register, muliFactorAuthentication, clearAllPersistedStates]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}


