import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const regEx = /^[^2]*/;

const initialState = {
  formVisibility: false,
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  whitelistIPs: [],
  currentWhitelistIP: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'whitelistIP',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    addWhitelistIPSuccess(state, action) {
      state.isLoading = false;
      state.whitelistIPs.push(action.payload);
    },

    // SET FORM VISIBILITY
    setWhitelistIPFormVisibility(state, action) {
      state.formVisibility = action.payload;
    },

    // GET WHITELIST IP LIST
    getWhitelistIPsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.whitelistIPs = action.payload;
      state.initial = true;
    },

    // SET SINGLE IP (FOR EDIT)
    setCurrentWhitelistIP(state, action) {
      state.currentWhitelistIP = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET SINGLE IP
    resetCurrentWhitelistIP(state) {
      state.currentWhitelistIP = null;
    },

    // SET RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET STATE
    resetWhitelistIPs(state) {
      state.whitelistIPs = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
      state.error = null;
      state.currentWhitelistIP = null;
    },

    // PAGINATION / FILTERS
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    ChangePage(state, action) {
      state.page = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { setWhitelistIPFormVisibility, resetWhitelistIPs, resetCurrentWhitelistIP, setFilterBy, ChangeRowsPerPage, ChangePage, setCurrentWhitelistIP } = slice.actions;

// ----------------------------------------------------------------------
// Thunk actions
export function addWhitelistIPs(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log('Sending payload:', data);
      const response = await axios.post(`${CONFIG.SERVER_URL}security/configs/Whitelistips/`, data);
      dispatch(slice.actions.addWhitelistIPSuccess(response.data));
      return response;
    } catch (error) {
      console.error('Failed to add Whitelist IP:', error);
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}

export function getWhitelistIPs() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/configs/Whitelistips`, {
        params: { isArchived: false },
      });
      dispatch(slice.actions.getWhitelistIPsSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}

export function getWhitelistIP(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/configs/Whitelistips/${id}`);
      dispatch(slice.actions.setCurrentWhitelistIP(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.message));
      throw error;
    }
  };
}

export function patchWhitelistIP(id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/configs/Whitelistips/${id}`, data);
      dispatch(slice.actions.setResponseMessage(response.data));
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export function deleteWhitelistIP(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/configs/Whitelistips/${id}`, {
        isArchived: true,
      });
      if (regEx.test(response.status)) {
        dispatch(slice.actions.setResponseMessage(response.data));
        dispatch(resetWhitelistIPs());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
