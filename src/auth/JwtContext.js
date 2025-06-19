import PropTypes from 'prop-types';
import storage from 'redux-persist/lib/storage';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { CONFIG } from '../config-global';
import axios from '../utils/axios';
import localStorageAvailable from '../utils/localStorageAvailable';
import { isValidToken, setSession, getUserAccess } from './utils';
import { PATH_AUTH } from '../routes/paths';

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  userId: null,
  userContacts: [],
  isAllAccessAllowed: false,
  isDisableDelete: true,
  isDashboardAccessLimited: true,
  isDocumentAccessAllowed: false,
  isDrawingAccessAllowed: false,
  isSettingReadOnly: true,
  isSecurityReadOnly: true,
  isSettingAccessAllowed: false,
  isSecurityUserAccessAllowed: false,
  isEmailAccessAllowed: false,
  isDeveloper: false,
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
        userId: action.payload.userId,
        userContacts: action.payload.userContacts,
        isAllAccessAllowed: action.payload.isAllAccessAllowed,
        isDisableDelete: action.payload.isDisableDelete,
        isDashboardAccessLimited: action.payload.isDashboardAccessLimited,
        isDocumentAccessAllowed: action.payload.isDocumentAccessAllowed,
        isDrawingAccessAllowed: action.payload.isDrawingAccessAllowed,
        isSettingReadOnly: action.payload.isSettingReadOnly,
        isSecurityReadOnly: action.payload.isSecurityReadOnly,
        isSettingAccessAllowed: action.payload.isSettingAccessAllowed,
        isSecurityUserAccessAllowed: action.payload.isSecurityUserAccessAllowed,
        isEmailAccessAllowed: action.payload.isEmailAccessAllowed,
        isDeveloper: action.payload.isDeveloper,
        // resetTokenTime: action.payload.resetTokenTime, // keeps track to avoid repeating the request
      };
    }
    case 'LOGIN': {
      const {
        user,
        userId,
        userContacts,
        isAllAccessAllowed,
        isDisableDelete,
        isDashboardAccessLimited,
        isDocumentAccessAllowed,
        isDrawingAccessAllowed,
        isSettingReadOnly,
        isSecurityReadOnly,
        isSettingAccessAllowed,
        isSecurityUserAccessAllowed,
        isEmailAccessAllowed,
        isDeveloper,
      } = action.payload;
      return {
        ...state,
        isAuthenticated: true,
        user,
        userId,
        userContacts,
        isAllAccessAllowed,
        isDisableDelete,
        isDashboardAccessLimited,
        isDocumentAccessAllowed,
        isDrawingAccessAllowed,
        isSettingReadOnly,
        isSecurityReadOnly,
        isSettingAccessAllowed,
        isSecurityUserAccessAllowed,
        isEmailAccessAllowed,
        isDeveloper,
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
        userId: null,
        userContacts: [],
        isAllAccessAllowed: false,
        isDisableDelete: true,
        isDashboardAccessLimited: true,
        isDocumentAccessAllowed: false,
        isDrawingAccessAllowed: false,
        isSettingReadOnly: true,
        isSecurityReadOnly: true,
        isSettingAccessAllowed: false,
        isSecurityUserAccessAllowed: false,
        isEmailAccessAllowed: false,
        isDeveloper: false,
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
        const user = {}
        user.customer = localStorage.getItem('customer');
        user.contact = localStorage.getItem('contact');
        user.email = localStorage.getItem('email');
        user.displayName = localStorage.getItem('name');
        const userContacts = JSON.parse(localStorage.getItem('userContacts'));
        const userId = localStorage.getItem('userId');

        const {
          isAllAccessAllowed,
          isDisableDelete,
          isDashboardAccessLimited,
          isDocumentAccessAllowed,
          isDrawingAccessAllowed,
          isSettingReadOnly,
          isSecurityReadOnly,
          isSettingAccessAllowed,
          isSecurityUserAccessAllowed,
          isEmailAccessAllowed,
          isDeveloper,
        } = getUserAccess()

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: true,
            user,
            userId,
            userContacts,
            isAllAccessAllowed,
            isDisableDelete,
            isDashboardAccessLimited,
            isDocumentAccessAllowed,
            isDrawingAccessAllowed,
            isSettingReadOnly,
            isSecurityReadOnly,
            isSettingAccessAllowed,
            isSecurityUserAccessAllowed,
            isEmailAccessAllowed,
            isDeveloper,
            // resetTokenTime, // added the timeout ID to the payload
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated: false,
            user: null,
            userContacts: [],
            isAllAccessAllowed: false,
            isDisableDelete: true,
            isDashboardAccessLimited: true,
            isDocumentAccessAllowed: false,
            isDrawingAccessAllowed: false,
            isSettingReadOnly: true,
            isSecurityReadOnly: true,
            isSettingAccessAllowed: false,
            isSecurityUserAccessAllowed: false,
            isEmailAccessAllowed: false,
            isDeveloper: false,
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
          userContacts: [],
          isAllAccessAllowed: false,
          isDisableDelete: true,
          isDashboardAccessLimited: true,
          isDocumentAccessAllowed: false,
          isDrawingAccessAllowed: false,
          isSettingReadOnly: true,
          isSecurityReadOnly: true,
          isSettingAccessAllowed: false,
          isSecurityUserAccessAllowed: false,
          isEmailAccessAllowed: false,
          isDeveloper: false,
          // resetTokenTime: null,
        },
      });
    }
  }, [storageAvailable, dispatch]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {

    const handleStorageChange = (event) => {
      if (event.key === 'accessToken') {
        if (event.newValue) {
          initialize();
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Clear All persisted data and remove Items from localStorage
  const clearAllPersistedStates = useCallback(async () => {
    try {
      await setSession(null);
      localStorage.removeItem('name');
      localStorage.removeItem('email');
      localStorage.removeItem('userId');
      localStorage.removeItem('userContacts');
      localStorage.removeItem('customer')
      localStorage.removeItem('contact')
      localStorage.removeItem('userRoles');
      localStorage.removeItem('accessToken');
      localStorage.removeItem("configurations");
      await dispatch({ type: 'LOGOUT' });
      const keys = Object.keys(localStorage);
      const reduxPersistKeys = keys.filter(key => !(key === 'remember' || key === 'hcp-login' || key === 'hcp-pass'));
      await Promise.all(reduxPersistKeys.map(key => storage.removeItem(key)));
    } catch (error) {
      console.error('Error clearing persisted states:', error);
    }
  }, []);

  const clearStorageAndNaviagteToLogin = useCallback(async () => {
    await clearAllPersistedStates();
    window.location.href = PATH_AUTH.login

  }, [clearAllPersistedStates]);

  // CONFIGURATIONS
  async function getConfigs() {
    const configsResponse = await axios.get(`${CONFIG.SERVER_URL}configs`, { params: { isActive: true, isArchived: false } });
    if (configsResponse && Array.isArray(configsResponse.data) && configsResponse.data.length > 0) {
      const configs = configsResponse.data.map((c) => ({ name: c.name, type: c.type, value: c.value, notes: c.notes }));
      localStorage.setItem("configurations", JSON.stringify(configs));
    }
  }

  // LOGIN
  const login = useCallback(async ({ email, password, recaptchaToken }) => {
    await dispatch(clearAllPersistedStates());
    const response = await axios.post(`${CONFIG.SERVER_URL}security/getToken`, { email, password, recaptchaToken })
    if (response.data.multiFactorAuthentication) {
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("MFA", true);
    } else {
      const { accessToken, user, userId, userContacts } = response.data;
      localStorage.setItem("customer", user?.customer);

      const {
        isAllAccessAllowed,
        isDisableDelete,
        isDashboardAccessLimited,
        isDocumentAccessAllowed,
        isDrawingAccessAllowed,
        isSettingReadOnly,
        isSecurityReadOnly,
        isSettingAccessAllowed,
        isSecurityUserAccessAllowed,
        isEmailAccessAllowed,
        isDeveloper,
      } = getUserAccess(user?.roles, user?.dataAccessibilityLevel)

      const rolesArrayString = JSON.stringify(user.roles);
      localStorage.setItem('email', user.email);
      localStorage.setItem('name', user.displayName);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userRoles', rolesArrayString);
      localStorage.setItem('dataAccessibilityLevel', user?.dataAccessibilityLevel);
      localStorage.setItem('customer', user?.customer)
      localStorage.setItem('contact', user?.contact)
      localStorage.setItem('userContacts', JSON.stringify(userContacts))

      setSession(accessToken);
      await getConfigs();
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
          userId,
          userContacts,
          isAllAccessAllowed,
          isDisableDelete,
          isDashboardAccessLimited,
          isDocumentAccessAllowed,
          isDrawingAccessAllowed,
          isSettingReadOnly,
          isSecurityReadOnly,
          isSettingAccessAllowed,
          isSecurityUserAccessAllowed,
          isEmailAccessAllowed,
          isDeveloper,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MULTI FACTOR CODE
  const muliFactorAuthentication = useCallback(async (code, userID) => {
    const response = await axios.post(`${CONFIG.SERVER_URL}security/multifactorverifyCode`, { code, userID })
    const { accessToken, user, userContacts, userId } = response.data;
    await setSession(accessToken);
    const {
      isAllAccessAllowed,
      isDisableDelete,
      isDashboardAccessLimited,
      isDocumentAccessAllowed,
      isDrawingAccessAllowed,
      isSettingReadOnly,
      isSecurityReadOnly,
      isSettingAccessAllowed,
      isSecurityUserAccessAllowed,
      isEmailAccessAllowed,
      isDeveloper,
    } = getUserAccess(user?.roles, user?.dataAccessibilityLevel)

    const rolesArrayString = JSON.stringify(user.roles);
    localStorage.setItem('email', user.email);
    localStorage.setItem('name', user.displayName);
    localStorage.setItem('userId', userId);
    localStorage.setItem('userRoles', rolesArrayString);
    localStorage.setItem('customer', user?.customer)
    localStorage.setItem('contact', user?.contact)
    localStorage.setItem('dataAccessibilityLevel', user?.dataAccessibilityLevel);
    localStorage.setItem('userContacts', JSON.stringify(userContacts))

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        userId,
        userContacts,
        isAllAccessAllowed,
        isDisableDelete,
        isDashboardAccessLimited,
        isDocumentAccessAllowed,
        isDrawingAccessAllowed,
        isSettingReadOnly,
        isSecurityReadOnly,
        isSettingAccessAllowed,
        isSecurityUserAccessAllowed,
        isEmailAccessAllowed,
        isDeveloper,
      },
    });
    await getConfigs();
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
  const logout = useCallback(async () => {
    const userId = localStorage.getItem("userId")
    try {
      localStorage.removeItem('accessToken');
      await axios.post(`${CONFIG.SERVER_URL}security/logout/${userId}`)
      await dispatch(clearStorageAndNaviagteToLogin());
    } catch (error) {
      console.error(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoization
  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      userId: state.userId,
      userContacts: state.userContacts,
      isAllAccessAllowed: state.isAllAccessAllowed,
      isDisableDelete: state.isDisableDelete,
      isDashboardAccessLimited: state.isDashboardAccessLimited,
      isDocumentAccessAllowed: state.isDocumentAccessAllowed,
      isDrawingAccessAllowed: state.isDrawingAccessAllowed,
      isSettingReadOnly: state.isSettingReadOnly,
      isSecurityReadOnly: state.isSecurityReadOnly,
      isSettingAccessAllowed: state.isSettingAccessAllowed,
      isSecurityUserAccessAllowed: state.isSecurityUserAccessAllowed,
      isEmailAccessAllowed: state.isEmailAccessAllowed,
      isDeveloper: state.isDeveloper,
      method: 'jwt',
      login,
      register,
      logout,
      clearStorageAndNaviagteToLogin,
      muliFactorAuthentication
    }),
    [state.isAuthenticated, state.isInitialized,
    state.isAllAccessAllowed,
    state.isDisableDelete,
    state.isDashboardAccessLimited,
    state.isDocumentAccessAllowed,
    state.isDrawingAccessAllowed,
    state.isSettingReadOnly,
    state.isSecurityReadOnly,
    state.isSettingAccessAllowed,
    state.isSecurityUserAccessAllowed,
    state.isEmailAccessAllowed,
    state.isDeveloper,
    state.userContacts,
    state.userId,
    state.user,
      login, logout, register, muliFactorAuthentication, clearStorageAndNaviagteToLogin]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}


