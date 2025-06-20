import axios from 'axios';
// config
import { HOST_API_KEY } from '../config-global';

// ----------------------------------------------------------------------

export const triggerErrorBoundary = (error) => {
  window.dispatchEvent(new CustomEvent('app-error', { detail: error }));
  throw error;
};

// Function to clear localStorage and log out user
const clearLocalStorageAndLogout = () => {
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  localStorage.removeItem('userRoles');
  localStorage.removeItem('accessToken');
  window.location.reload();
};

class NotAcceptableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotAcceptableError';
  }
}

const axiosInstance = axios.create({ baseURL: HOST_API_KEY });

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['X-Client-Page'] = window.location.href;
    return config;
  }, (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      // If the response status is 403 (Forbidden), clear localStorage and log out the user
      clearLocalStorageAndLogout();
    }

    // Handle 406 Not Acceptable
    if (error.response && error.response.status === 406) {
      const notAcceptableError = new NotAcceptableError(error.response.data?.message || 'Not Acceptable Request');
      triggerErrorBoundary(notAcceptableError);
    }

    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);

export default axiosInstance;
