import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
// import jwtDecode from 'jwt-decode';
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

  // LOGIN

  async function getConfigs(){
    localStorage.removeItem("configurations");
    const configsResponse = await axios.get(`${CONFIG.SERVER_URL}configs`,
    {
      params: {
        isActive: true,
        isArchived: false
      }
    });
    if(configsResponse && Array.isArray(configsResponse.data) && configsResponse.data.length>0 ) {
      const configs = configsResponse.data.map((c)=>({name:c.name, type:c.type, value:c.value, notes:c.notes}));
      localStorage.setItem("configurations",JSON.stringify(configs));
    }
  }

   
  const login = useCallback(async (email, password) => {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('accessToken');

    const response = await axios.post(`${CONFIG.SERVER_URL}security/getToken`, {
      email,
      password,
    })

    

    if (response.data.multiFactorAuthentication){
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("MFA", true);
    }
    else{
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
        payload: {
          user,
          userId
        },
      });
    }

    
  }, []);

  // MULTI FACTOR CODE

  const muliFactorAuthentication = useCallback(async (code, userID) => {

    const response = await axios.post(`${CONFIG.SERVER_URL}security/multifactorverifyCode`, {
      code, userID
    })

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
    await axios.post(`${CONFIG.SERVER_URL}security/logout/${userId}`)

    setSession(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('accessToken');
    window.location.reload();
    // localStorage.clear();
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
      muliFactorAuthentication
    }),
    [state.isAuthenticated, state.isInitialized, state.user, state.userId, login, logout, register, muliFactorAuthentication]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
