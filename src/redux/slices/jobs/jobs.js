import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  job: null,
  jobs: [],
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
  name: 'jobs',
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

    // GET Jobs Success
    getJobsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.jobs = action.payload;
      state.initial = true;
    },

    // GET Job Success
    getJobSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.job = action.payload;
      state.initial = true;
    },

    // POST Job Success
    postJobSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.job = action.payload;
      state.responseMessage = 'Job created successfully';
    },
    
    patchJobSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.job = action.payload;
      state.responseMessage = 'Job updated successfully.';
    },

    deleteJobSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.jobs = state.jobs.filter((job) => job._id !== action.payload);
      state.responseMessage = 'Job Archived successfully.';
    },

    // SET RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET Job
    resetJob(state) {
      state.job = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Jobs
    resetJobs(state) {
      state.jobs = [];
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
  resetJob,
  resetJobs,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Job
export function postJob(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
          measurementUnit: params.measurementUnit,
          profile: params.profile,
          frameset: params.frameset,
          version: params.version,
          components: params.components,
        };
      const response = await axios.post(`${CONFIG.SERVER_URL}jobs/`, data);
      dispatch(slice.actions.postJobSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Job
export function patchJob(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
          measurementUnit: params.measurementUnit,
          profile: params.profile,
          frameset: params.frameset,
          version: params.version,
          components: params.components,
        };
      const response = await axios.patch(`${CONFIG.SERVER_URL}jobs/${id}`, data);
      dispatch(slice.actions.patchJobSuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Jobs
export function getJobs(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false,
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}jobs/`, { params });
      dispatch(slice.actions.getJobsSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Job
export function getJob(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}jobs/${id}`);
      dispatch(slice.actions.getJobSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// Archive Job
export function deleteJob(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}jobs/${id}`, data);
      dispatch(slice.actions.deleteJobSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}