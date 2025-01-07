import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticket: null,
  tickets: [],
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
  name: 'tickets',
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
    getTicketsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.tickets = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticket = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticket = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    deleteTicketSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.tickets = state.tickets.filter((ticket) => ticket._id !== action.payload);
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
    resetTicket(state) {
      state.ticket = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTickets(state) {
      state.tickets = [];
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
  resetTicket,
  resetTickets,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicket(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        customer: params?.customer?._id || null,
        machine: params?.machine?._id || null,
        issueType: params.issueType,
        summary: params.summary,
        description: params.description,
        changeType: params.changeType,
        impact: params.impact,
        priority: params.priority,
        status: params.status,
        changeReason: params.changeReason,
        implementationPlan: params.implementationPlan,
        backoutPlan: params.backoutPlan,
        testPlan: params.testPlan,
        shareWith: params.shareWith,
        rootCause: params.rootCause,
        workaround: params.workaround,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/`, data);
      dispatch(slice.actions.postTicketSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicket(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        customer: params?.customer?._id || null,
        machine: params?.machine?._id || null,
        issueType: params.issueType,
        summary: params.summary,
        description: params.description,
        changeType: params.changeType,
        impact: params.impact,
        priority: params.priority,
        status: params.status,
        changeReason: params.changeReason,
        implementationPlan: params.implementationPlan,
        backoutPlan: params.backoutPlan,
        testPlan: params.testPlan,
        shareWith: params.shareWith,
        rootCause: params.rootCause,
        workaround: params.workaround,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/${id}`, data);
      dispatch(slice.actions.getTicketSuccess(response.data)); 
      dispatch(slice.actions.setResponseMessage('Ticket updated successfully.'));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTickets(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets`, { params });
      dispatch(slice.actions.getTicketsSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicket(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/${id}`);
      dispatch(slice.actions.getTicketSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// DELETE Ticket
export function deleteTicket(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`${CONFIG.SERVER_URL}ticket/${id}`);
      dispatch(slice.actions.deleteTicketSuccess(id));
      dispatch(slice.actions.setResponseMessage('Ticket deleted successfully.'));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}
