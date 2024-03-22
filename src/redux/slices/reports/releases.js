import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  release: {},
  releases: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  initial: false,
  error: null,
  success: false,
  isLoading: false,
  responseMessage: null,
};

const slice = createSlice({
  name: 'releases',
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


    // GET regions
    getReleasesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.releases = action.payload;
      state.initial = true;
    },

    getReleaseSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.release = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET Release
    resetRelease(state){
      state.release = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Releases
    resetReleases(state){
      state.releases = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
        // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
    ChangePage(state, action) {
      state.page = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getReleasesSuccess,
  getReleaseSuccess,
  resetRelease,
  resetReleases,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;


// ----------------------------------------------------------------------

export function getReleases() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}jira/releases`);
        dispatch(slice.actions.getReleasesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  }
}


// ----------------------------------------------------------------------

export function getRelease(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}jira/releases/${id}`);
        dispatch(slice.actions.getReleaseSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  };
}


