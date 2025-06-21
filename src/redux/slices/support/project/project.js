import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  projects: [],
  activeProjects: [],
  project: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100
};

const slice = createSlice({
  name: 'project',
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

    // GET Setting
    getProjectsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.projects = action.payload;
      state.initial = true;
    },

    // GET Active Setting
    getActiveProjectsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeProjects = action.payload;
      state.initial = true;
    },

    // GET Setting
    getProjectSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.project = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET DOCUMENT NAME
    resetProject(state) {
      state.project = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET DOCUMENT NAME
    resetProjects(state) {
      state.projects = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Active DOCUMENT NAME
    resetActiveProjects(state) {
      state.activeProjects = [];
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
    setReportHiddenColumns(state, action) {
      state.reportHiddenColumns = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetProject,
  resetProjects,
  resetActiveProjects,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns,
} = slice.actions;

// ----------------------------Add Project------------------------------------------

export function addProject(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        projectNo: params.projectNo,
        name: params.name,
        startDate: params.startDate,
        endDate: params.endDate,
        description: params.description,
        customerAccess: params.customerAccess,
        isActive: params.isActive,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}support/project/`, data);
      dispatch(slice.actions.setResponseMessage('Project saved successfully'));
      return response?.data;
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Project-------------------------------------

export function updateProject(Id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        projectNo: params.projectNo,
        name: params.name,
        startDate: params.startDate,
        endDate: params.endDate,
        description: params.description,
        customerAccess: params.customerAccess,
        isActive: params.isActive,
      }
      await axios.patch(`${CONFIG.SERVER_URL}support/project/${Id}`, data,);
      dispatch(slice.actions.setResponseMessage('Project updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Project Status-------------------------------------
export function updateProjectStatus(Id, params) {
  return async (dispatch) => {
    try {
      const data = {
        status: params.status
      }
      await axios.patch(`${CONFIG.SERVER_URL}support/project/${Id}`, data,);
      dispatch(slice.actions.setResponseMessage('Project status updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Project-----------------------------------

export function getProjects(isArchived, page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/project/list`,
        {
          params: {
            pagination: { page, pageSize },
            isArchived: isArchived || false
          }
        }
      );
      dispatch(slice.actions.getProjectsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Projects loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// -----------------------------------Get Active Project-----------------------------------

export function getActiveProjects() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const query = {
        params: {
          isArchived: false,
          isActive: true,
        }
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}support/project/list`, query);
      dispatch(slice.actions.getActiveProjectsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Projects loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      // throw error;
    }
  };
}

// -------------------------------get Project---------------------------------------

export function getProject(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/project/${Id}`);
      dispatch(slice.actions.getProjectSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Project Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------archive Project-------------------------------------

export function archiveProject(Id) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}support/project/${Id}`,
        {
          isArchived: true,
        });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function restoreProject(Id) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}support/project/${Id}`,
        {
          isArchived: false,
        });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteProject(Id) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}support/project/${Id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}