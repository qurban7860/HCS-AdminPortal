import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback, useMemo } from 'react';
import { Auth0Client } from '@auth0/auth0-spa-js';
// config
import { AUTH0_API } from '../config-global';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
  userId: null,
  isSuperAdmin: false,
  isDisableDelete: true,
  isSettingAccessAllowed: false,
  isSecurityUserAccessAllowed: false,
  isDocumentAccessAllowed: false,
  isDrawingAccessAllowed: false,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      isInitialized: true,
      isAuthenticated: action.payload.isAuthenticated,
      user: action.payload.user,
      userId: action.payload.userId,
      isSuperAdmin: action.payload.isSuperAdmin,
      isDisableDelete: action.payload.isDisableDelete,
      isSettingAccessAllowed: action.payload.isSettingAccessAllowed,
      isSecurityUserAccessAllowed: action.payload.isSecurityUserAccessAllowed,
      isDocumentAccessAllowed: action.payload.isDocumentAccessAllowed,
      isDrawingAccessAllowed: action.payload.isDrawingAccessAllowed,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      isAuthenticated: true,
      user: action.payload.user,
      userId: action.payload.userId,
      isSuperAdmin: action.payload.isSuperAdmin,
      isDisableDelete: action.payload.isDisableDelete,
      isConfigReadOnly: action.payload.isConfigReadOnly,
      isSettingAccessAllowed: action.payload.isSettingAccessAllowed,
      isSecurityUserAccessAllowed: action.payload.isSecurityUserAccessAllowed,
      isDocumentAccessAllowed: action.payload.isDocumentAccessAllowed,
      isDrawingAccessAllowed: action.payload.isDrawingAccessAllowed,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
      userId: null,
      isSuperAdmin: false,
      isDisableDelete: true,
      isConfigReadOnly: true,
      isSettingAccessAllowed: false,
      isSecurityUserAccessAllowed: false,
      isDocumentAccessAllowed: false,
      isDrawingAccessAllowed: false,
    };
  }

  return state;
};

// ----------------------------------------------------------------------

export const AuthContext = createContext(null);

// ----------------------------------------------------------------------

let auth0Client = null;

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      auth0Client = new Auth0Client({
        clientId: AUTH0_API.clientId || '',
        domain: AUTH0_API.domain || '',
        authorizationParams: {
          redirect_uri: window.location.origin,
        },
      });

      await auth0Client.checkSession();

      const isAuthenticated = await auth0Client.isAuthenticated();

      if (isAuthenticated) {
        const user = await auth0Client.getUser();

        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated,
            user: {
              ...user,
              ...userId,
              ...isSuperAdmin,
              ...isDisableDelete,
              ...isConfigReadOnly,
              ...isSettingAccessAllowed,
              ...isSecurityUserAccessAllowed,
              ...isDocumentAccessAllowed,
              ...isDrawingAccessAllowed,
              displayName: user?.name,
              photoURL: user?.picture,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            isAuthenticated,
            user: null,
            userId: null,
            isSuperAdmin,
            isDisableDelete,
            isConfigReadOnly,
            isSettingAccessAllowed,
            isSecurityUserAccessAllowed,
            isDocumentAccessAllowed,
            isDrawingAccessAllowed,
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
          userId: null,
          isSuperAdmin: false,
          isDisableDelete: true,
          isConfigReadOnly: true,
          isSettingAccessAllowed: false,
          isSecurityUserAccessAllowed: false,
          isDocumentAccessAllowed: false,
          isDrawingAccessAllowed: false,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async () => {
    await auth0Client?.loginWithPopup();

    const isAuthenticated = await auth0Client?.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client?.getUser();

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            ...user,
            userId: user?._id,
            displayName: user?.name,
            isSuperAdmin: user?.roles?.some((role) => role.roleType === 'SuperAdmin'),
            isDisableDelete: user?.roles?.some((role) => role.roleType === 'SuperAdmin'),
            isConfigReadOnly: user?.roles?.some((role) => role.roleType === 'SuperAdmin'),
            isSettingAccessAllowed: user?.roles?.some((role) => role.roleType === 'SuperAdmin'),
            isSecurityUserAccessAllowed: user?.roles?.some((role) => role.roleType === 'SuperAdmin'),
            isDocumentAccessAllowed: user?.roles?.some((role) => role.roleType === 'SuperAdmin'),
            isDrawingAccessAllowed: user?.roles?.some((role) => role.roleType === 'SuperAdmin'),
            photoURL: user?.picture,
          },
        },
      });
    }
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    auth0Client?.logout();
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized: state.isInitialized,
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      isSuperAdmin: state.isSuperAdmin,
      isDisableDelete: state.isDisableDelete,  
      isConfigReadOnly: state.isConfigReadOnly, 
      isSettingAccessAllowed: state.isSettingAccessAllowed, 
      isSecurityUserAccessAllowed: state.isSecurityUserAccessAllowed, 
      isDocumentAccessAllowed: state.isDocumentAccessAllowed, 
      isDrawingAccessAllowed: state.isDrawingAccessAllowed, 
      userId: state.userId,
      method: 'auth0',
      login,
      logout,
    }),
    [state.isAuthenticated, state.isInitialized, state.user, 
      state.isSuperAdmin, 
      state.isDisableDelete,  
      state.isConfigReadOnly, 
      state.isSettingAccessAllowed, 
      state.isSecurityUserAccessAllowed, 
      state.isDocumentAccessAllowed, 
      state.isDrawingAccessAllowed, 
      state.userId, login, logout]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
