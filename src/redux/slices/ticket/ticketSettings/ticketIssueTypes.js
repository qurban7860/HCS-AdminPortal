import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketIssueType: null,
  ticketIssueTypes: [],
  activeTicketIssueTypes: [],
  openTicketIssueTypes: [],
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
  name: 'ticketIssueTypes',
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

    // GET Tickets Success
    getTicketIssueTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketIssueTypes = action.payload;
      state.initial = true;
    },
    
    // GET Tickets Success
    getReportTicketIssueTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketIssueTypes = action.payload;
      state.initial = true;
    },

    // GET  Active Tickets Success
    getOpenTicketIssueTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.openTicketIssueTypes = action.payload;
      state.initial = true;
    },
    
     // GET  Active Tickets Success
     getActiveTicketIssueTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeTicketIssueTypes = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketIssueTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketIssueType = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketIssueTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketIssueType = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    patchTicketIssueTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketIssueType = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
    },

    deleteTicketIssueTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketIssueTypes = state.ticketIssueTypes.filter((ticketIssueType) => ticketIssueType._id !== action.payload);
      state.responseMessage = 'Ticket deleted successfully.';
    },

    // SET RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET Ticket
    resetTicketIssueType(state) {
      state.ticketIssueType = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTicketIssueTypes(state) {
      state.ticketIssueTypes = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    
    // RESET Active Tickets
    resetActiveTicketIssueTypes(state) {
      state.activeTicketIssueTypes = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    
    resetOpenTicketIssueTypes(state) {
      state.openTicketIssueTypes = [];
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
  resetTicketIssueType,
  resetTicketIssueTypes,
  resetActiveTicketIssueTypes,
  resetOpenTicketIssueTypes,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicketIssueType(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
            name: params.name,
            icon: params.icon,
            color: params.color,
            slug: params.slug,
            displayOrderNo: params.displayOrderNo,
            description: params.description,
            isDefault: params.isDefault,
            isActive: params.isActive,
        };
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/settings/issueTypes/`, data);
      dispatch(slice.actions.postTicketIssueTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicketIssueType(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
          name: params.name,
          icon: params.icon,
          color: params.color,
          slug: params.slug,
          displayOrderNo: params.displayOrderNo,
          description: params.description,
          isDefault: params.isDefault,
          isActive: params.isActive,
        };
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/issueTypes/${id}`, data);
      dispatch(slice.actions.patchTicketIssueTypeSuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTicketIssueTypes(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false,
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/issueTypes`, { params });
      dispatch(slice.actions.getTicketIssueTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getReportTicketIssueTypes(value = null, unit = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        isArchived: false,
      };
      
      if (value !== null && unit !== null) {
        params.value = value;
        params.unit = unit;
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/issueTypes/count`, { params });
      dispatch(slice.actions.getReportTicketIssueTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getOpenTicketIssueTypes(value = null, unit = null) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        isArchived: false,
        isResolved: false,
      };
      if (value !== null && unit !== null) {
        params.value = value;
        params.unit = unit;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/issueTypes/count`, { params });
      dispatch(slice.actions.getOpenTicketIssueTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicketIssueType(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/issueTypes/${id}`);
      dispatch(slice.actions.getTicketIssueTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getActiveTicketIssueTypes ( cancelToken ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/issueTypes`, 
      {
        params: {
          isArchived: false,
          isActive: true,
        },
        cancelToken: cancelToken?.token,
      });
      dispatch(slice.actions.getActiveTicketIssueTypesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Issue loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// Archive Ticket
export function deleteTicketIssueType(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/issueTypes/${id}`, data);
      dispatch(slice.actions.deleteTicketIssueTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}
