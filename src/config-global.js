// routes
import { PATH_DASHBOARD } from './routes/paths';

// ----------------------------------------------------------------------

export const CONFIG = {
  APP_CODE: process.env.REACT_APP_CODE,
  PORTAL_LOGIN_URL: process.env.PORTAL_LOGIN_URL,
  APP_TITLE: process.env.REACT_APP_TITLE,
  APP_NAME: process.env.REACT_APP_NAME,
  ENV: process.env.REACT_APP_ENV,
  Version: process.env.REACT_APP_VERSION,
  Background_Color: process.env.REACT_APP_BG_COLOR,
  SERVER_URL: process.env.REACT_APP_SERVER_URL,
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL,
  MESSAGE_REGISTER_USER: process.env.REACT_APP_MESSAGE_REGISTER_USER,
  MESSAGE_LOGIN_USER: process.env.REACT_APP_MESSAGE_LOGIN_USER,
  GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  RECAPTCHA_KEY: process.env.REACT_APP_RECAPTCHA_KEY,
  IDLE_TIME: process.env.REACT_APP_IDLE_TIME,
  JIRA_URL: 'https://howickltd.atlassian.net/jira/servicedesk/projects/HWKSC/queues/custom/3/',
  COMPOSITE_TOOL_CONFIG_MAX_LENGTH: process.env.COMPOSITE_TOOL_CONFIG_MAX_LENGTH = 10,
};

export const HOST_API_KEY = process.env.REACT_APP_SERVER_URL || '';


export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const COGNITO_API = {
  userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
};

export const MAP_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.root; // as '/dashboard/app'

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
  H_MOBILE: 64,
  H_MAIN_DESKTOP: 88,
  H_DASHBOARD_DESKTOP: 65,
  H_DASHBOARD_DESKTOP_OFFSET: 92 - 32,
};

export const NAV = {
  W_BASE: 220,
  W_DASHBOARD: 240,
  W_DASHBOARD_MINI: 88,
  //
  H_DASHBOARD_ITEM: 48,
  H_DASHBOARD_ITEM_SUB: 36,
  //
  H_DASHBOARD_ITEM_HORIZONTAL: 32,
};

export const ICON = {
  NAV_ITEM: 24,
  NAV_ITEM_HORIZONTAL: 22,
  NAV_ITEM_MINI: 22,
};
