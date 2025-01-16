import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
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
    
    patchTicketSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticket = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
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
        issueType: params.issueType?._id || null,
        summary: params.summary || '',
        description: params.description || '',
        files: params.files || [],
        changeType: params.changeType?._id || null,
        impact: params.impact?._id || null,
        priority: params.priority?._id || null,
        status: params.status?._id || null,
        changeReason: params.changeReason?._id || null,
        investigationReason: params.investigationReason?._id || null,
        implementationPlan: params.implementationPlan || '',
        backoutPlan: params.backoutPlan || '',
        testPlan: params.testPlan || '',
        shareWith: params.shareWith,
        rootCause: params.rootCause || '',
        workaround: params.workaround || '',
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
        issueType: params.issueType?._id || null,
        summary: params.summary || '',
        description: params.description || '',
        files: params.files || [],
        changeType: params.changeType?._id || null,
        impact: params.impact?._id || null,
        priority: params.priority?._id || null,
        status: params.status?._id || null,
        changeReason: params.changeReason?._id || null,
        investigationReason: params.investigationReason?._id || null,
        implementationPlan: params.implementationPlan || '',
        backoutPlan: params.backoutPlan || '',
        testPlan: params.testPlan || '',
        shareWith: params.shareWith,
        rootCause: params.rootCause || '',
        workaround: params.workaround || '',
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/${id}`, data);
      dispatch(slice.actions.patchTicketSuccess(response.data)); 
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
        isArchived: false,
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

// ARCHIVE Ticket
export function deleteTicket(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/${id}`, data);
      dispatch(slice.actions.deleteTicketSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

