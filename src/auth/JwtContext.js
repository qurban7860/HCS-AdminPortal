import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import jwtDecode from 'jwt-decode';
// import { ROOT_CONFIG } from 'src/config-global';
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
  resetTokenTime: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL': {
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
        resetTokenTime: action.payload.resetTokenTime, // keeps track to avoid repeating the request
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
        resetTokenTime: null, // reset the timeout ID when logging out
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

        const tokenExpTime = jwtDecode(accessToken).exp * 1000;
        const tokenRefreshTime = tokenExpTime - 20 * 60 * 1000;
        const resetTokenTime = setTimeout(async () => {
          try {
            const response = await axios.post(`${CONFIG.SERVER_URL}security/refreshToken`, {
              userID: userId,
            });
            const newAccessToken = response.data.accessToken;

            localStorage.setItem('accessToken', newAccessToken);

            initialize();
          } catch (error) {
            console.error(error);
          }
        }, tokenRefreshTime - Date.now() + 30 * 1000);

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
            userId,
            resetTokenTime, // added the timeout ID to the payload
           },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
            resetTokenTime: null, // reset the timeout ID when not authenticated
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
          resetTokenTime: null,
        },
      });
    }
  }, [storageAvailable, dispatch]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN

  const login = useCallback(async (email, password) => {
    const response = await axios.post(`${CONFIG.SERVER_URL}security/getToken`, {
      email,
      password,
    })

    const { accessToken, user, userId } = response.data;
    localStorage.setItem('email', user.email);
    localStorage.setItem('name', user.displayName);
    localStorage.setItem('userId', userId);


    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        userId
      },
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

  // LOGOUT
  const logout = useCallback( async () => {
    const userId  = localStorage.getItem("userId")
    const response = await axios.post(`${CONFIG.SERVER_URL}security/logout/${userId}`)
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

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
    }),
    [state.isAuthenticated, state.isInitialized, state.user, state.userId, login, logout, register]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
