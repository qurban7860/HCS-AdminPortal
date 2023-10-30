import axios from 'axios';
// config
import { HOST_API_KEY } from '../config-global';

// ----------------------------------------------------------------------
// Function to clear localStorage and log out user
const clearLocalStorageAndLogout = () => {
  // Clear access token from localStorage
  localStorage.removeItem('userId');
  localStorage.removeItem('email');
  localStorage.removeItem('name');
  localStorage.removeItem('userRoles');
  localStorage.removeItem('accessToken');
  window.location.reload();
};

const axiosInstance = axios.create({ baseURL: HOST_API_KEY });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // checking every request
    if (error.response && error.response.status === 403) {
      // If the response status is 403 (Forbidden), clear localStorage and log out the user
      clearLocalStorageAndLogout();
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  }
);


export default axiosInstance;
