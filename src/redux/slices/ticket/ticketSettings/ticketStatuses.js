import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketStatus: null,
  ticketStatuses: [],
  activeTicketStatuses: [],
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
  name: 'ticketStatuses',
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
    getTicketStatusesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatuses = action.payload;
      state.initial = true;
    },
    
    // GET Tickets Success
    getReportTicketStatusesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatuses = action.payload;
      state.initial = true;
    },

    // GET Active Tickets Success
    getActiveTicketStatusesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeTicketStatuses = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketStatusSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatus = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketStatusSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatus = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    patchTicketStatusSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatus = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
    },

    deleteTicketStatusSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatuses = state.ticketStatuses.filter((ticketStatus) => ticketStatus._id !== action.payload);
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
    resetTicketStatus(state) {
      state.ticketStatus = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTicketStatuses(state) {
      state.ticketStatuses = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetActiveTicketStatuses(state) {
      state.activeTicketStatuses = [];
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
  resetTicketStatus,
  resetTicketStatuses,
  resetActiveTicketStatuses,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicketStatus(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
          name: params.name,
          statusType: params.statusType?._id || null,
          icon: params.icon,
          color: params.color,
          slug: params.slug,
          displayOrderNo: params.displayOrderNo,
          description: params.description,
          isDefault: params.isDefault,
          isActive: params.isActive,
        };
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/settings/statuses/`, data);
      dispatch(slice.actions.postTicketStatusSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicketStatus(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
          name: params.name,
          statusType: params.statusType?._id || null,
          icon: params.icon,
          color: params.color,
          slug: params.slug,
          displayOrderNo: params.displayOrderNo,
          description: params.description,
          isDefault: params.isDefault,
          isActive: params.isActive,
        };
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/statuses/${id}`, data);
      dispatch(slice.actions.patchTicketStatusSuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTicketStatuses(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/statuses`, { params });
      dispatch(slice.actions.getTicketStatusesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getReportTicketStatuses(value = null, unit = null) {
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
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/statuses/count`, { params });
      dispatch(slice.actions.getReportTicketStatusesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Active Statuses
export function getActiveTicketStatuses ( cancelToken ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/statuses`, 
      {
        params: {
          isArchived: false,
          isActive: true,
        },
        cancelToken: cancelToken?.token,
      });
      dispatch(slice.actions.getActiveTicketStatusesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('statuses loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// GET Ticket
export function getTicketStatus(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/statuses/${id}`);
      dispatch(slice.actions.getTicketStatusSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// Archive Ticket

export function deleteTicketStatus(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/statuses/${id}`, data);
      dispatch(slice.actions.deleteTicketStatusSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}