import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';
import { handleError } from '../../../../utils/errorHandler';

// ----------------------------------------------------------------------
const initialState = {
  release: null,
  releases: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  initial: false,
  error: null,
  success: false,
  isLoading: false,
  responseMessage: null,
  activeReleases: [],
};

const slice = createSlice({
  name: 'release',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET releases Success
    getReleasesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.releases = action.payload;
      state.initial = true;
    },
    
    getActiveReleasesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeReleases = action.payload;
      state.initial = true;
    },

    // GET release Success
    getReleaseSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.release = action.payload;
      state.initial = true;
    },

    // SET RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET release
    resetRelease(state) {
      state.release = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET releases
    resetReleases(state) {
      state.releases = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    
    // RESET Active 
    resetActiveReleases(state) {
      state.activeReleases = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // SET FILTER BY
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },

    // SET PAGE ROW COUNT
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },

    // SET PAGE NUMBER
    ChangePage(state, action) {
      state.page = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetRelease,
  resetReleases,
  resetActiveReleases,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST release
export function postRelease(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        name: data.name,
        releaseNo: data.releaseNo,
        project: data.project?._id,
        releaseDate: data.releaseDate,
        description: data.description,
        isActive: data.isActive,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}support/release/`, params);
      dispatch(slice.actions.setResponseMessage('Release saved successfully'));
      return response?.data;
    } catch (error) {
      console.log(handleError(error));
      dispatch(slice.actions.hasError(handleError(error)));
      throw error;
    }
  };
}

// PATCH release
export function patchRelease(id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        name: data.name,
        releaseNo: data.releaseNo,
        project: data.project?._id,
        releaseDate: data.releaseDate,
        description: data.description,
        isActive: data.isActive,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}support/release/${id}`, params);
      dispatch(slice.actions.setResponseMessage('Release updated successfully'));
      return response?.data;
    } catch (error) {
      console.log(handleError(error));
      dispatch(slice.actions.hasError(handleError(error)));
      throw error;
    }
  };
}

// ---------------------------------Update Release Status-------------------------------------
export function updateReleaseStatus(Id, params) {
  return async (dispatch) => {
    try {
      const data = {
        status: params.status
      }
      await axios.patch(`${CONFIG.SERVER_URL}support/release/${Id}`, data,);
      dispatch(slice.actions.setResponseMessage('Release status updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// GET releases
export function getReleases(isArchived, page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/release/list`,
        {
          params: {
            pagination: { page, pageSize },
            isArchived: false
          }
        }
      );
      dispatch(slice.actions.getReleasesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Releases loaded successfully'));
      return response;
    } catch (error) {
      console.log(handleError(error));
      dispatch(slice.actions.hasError(handleError(error)));
      throw error;
    }
  };
}

export function getActiveReleases() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const query = {
        params: {
          isArchived: false,
          isActive: true,
        }
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}support/release/list`, query);
      dispatch(slice.actions.getActiveReleasesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Releases loaded successfully'));
    } catch (error) {
      console.log(handleError(error));
      dispatch(slice.actions.hasError(handleError(error)));
      // throw error;
    }
  };
}

// GET release
export function getRelease(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/release/${id}`);
      dispatch(slice.actions.getReleaseSuccess(response.data));
      return response;
    } catch (error) {
      console.log(handleError(error));
      dispatch(slice.actions.hasError(handleError(error)));
      throw error;
    }
  };
}

// DELETE release
export function deleteRelease(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}support/release/${id}`, data);
      dispatch(slice.actions.setResponseMessage(response.data));
      return response;
    } catch (error) {
      console.log(handleError(error));
      dispatch(slice.actions.hasError(handleError(error)));
      throw error;
    }
  };
}

