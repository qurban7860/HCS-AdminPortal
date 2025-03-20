import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketRequestType: null,
  ticketRequestTypes: [],
  activeTicketRequestTypes: [],
  openTicketRequestTypes: [],
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
  name: 'ticketRequestTypes',
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
    getTicketRequestTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketRequestTypes = action.payload;
      state.initial = true;
    },

    // GET  Active Tickets Success
    getActiveTicketRequestTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeTicketRequestTypes = action.payload;
      state.initial = true;
    },
    
    // GET  Open Tickets Success
    getReportTicketRequestTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketRequestTypes = action.payload;
      state.initial = true;
    },

    // GET  Open Tickets Success
    getOpenTicketRequestTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.openTicketRequestTypes = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketRequestTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketRequestType = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketRequestTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketRequestType = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    patchTicketRequestTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketRequestType = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
    },

    deleteTicketRequestTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketRequestTypes = state.ticketRequestTypes.filter((ticketRequestType) => ticketRequestType._id !== action.payload);
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
    resetTicketRequestType(state) {
      state.ticketRequestType = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTicketRequestTypes(state) {
      state.ticketRequestTypes = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Active Tickets
    resetActiveTicketRequestTypes(state) {
      state.activeTicketRequestTypes = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Open Tickets
    resetOpenTicketRequestTypes(state) {
      state.openTicketRequestTypes = [];
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
  resetTicketRequestType,
  resetTicketRequestTypes,
  resetActiveTicketRequestTypes,
  resetOpenTicketRequestTypes,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicketRequestType(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
            name: params.name,
            issueType: params.issueType?._id || null,
            icon: params.icon,
            color: params.color,
            slug: params.slug,
            displayOrderNo: params.displayOrderNo,
            description: params.description,
            isDefault: params.isDefault,
            isActive: params.isActive,
        };
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/settings/RequestTypes/`, data);
      dispatch(slice.actions.postTicketRequestTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicketRequestType(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
          name: params.name,
          issueType: params.issueType?._id || null,
          icon: params.icon,
          color: params.color,
          slug: params.slug,
          displayOrderNo: params.displayOrderNo,
          description: params.description,
          isDefault: params.isDefault,
          isActive: params.isActive,
        };
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/RequestTypes/${id}`, data);
      dispatch(slice.actions.patchTicketRequestTypeSuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTicketRequestTypes(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false,
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/RequestTypes`, { params });
      dispatch(slice.actions.getTicketRequestTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getReportTicketRequestTypes(value = null, unit = null) {
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

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/requestTypes/count`, { params });
      dispatch(slice.actions.getReportTicketRequestTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getOpenTicketRequestTypes(value = null, unit = null) {
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

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/requestTypes/count`, { params });
      dispatch(slice.actions.getOpenTicketRequestTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicketRequestType(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/RequestTypes/${id}`);
      dispatch(slice.actions.getTicketRequestTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getActiveTicketRequestTypes ( cancelToken ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/RequestTypes`, 
      {
        params: {
          isArchived: false,
          isActive: true,
        },
        cancelToken: cancelToken?.token,
      });
      dispatch(slice.actions.getActiveTicketRequestTypesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Request loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// Archive Ticket
export function deleteTicketRequestType(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/RequestTypes/${id}`, data);
      dispatch(slice.actions.deleteTicketRequestTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}
