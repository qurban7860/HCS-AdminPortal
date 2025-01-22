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
    
    deleteTicketFileSuccess(state, action) {
      state.isLoading = false;
      const ticketClone = _.cloneDeep(state.ticket);
      ticketClone.extendedProps.files = ticketClone.extendedProps.files?.filter(file => file._id !== action.payload?._id);
      state.ticket = ticketClone;
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
      const formData = new FormData();

      formData.append('customer', params?.customer?._id );
      formData.append('machine', params?.machine?._id );
      formData.append('issueType', params?.issueType?._id );
      formData.append('summary', params?.summary || '');
      formData.append('description', params?.description || '');
      formData.append('changeType', params?.changeType?._id || null);
      formData.append('impact', params?.impact?._id || null);
      formData.append('priority', params?.priority?._id || null);
      formData.append('status', params?.status?._id || null);
      formData.append('changeReason', params?.changeReason?._id || null);
      formData.append('investigationReason', params?.investigationReason?._id || null);
      formData.append('implementationPlan', params?.implementationPlan || '');
      formData.append('backoutPlan', params?.backoutPlan || '');
      formData.append('testPlan', params?.testPlan || '');
      formData.append('shareWith', params?.shareWith );
      formData.append('isActive', params?.isActive );
      formData.append('rootCause', params?.rootCause || '');
      formData.append('workaround', params?.workaround || '');

      (params?.files || []).forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/`, formData);

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
      const formData = new FormData();

      formData.append('customer', params?.customer?._id );
      formData.append('machine', params?.machine?._id );
      formData.append('issueType', params?.issueType?._id );
      formData.append('summary', params?.summary || '');
      formData.append('description', params?.description || '');
      formData.append('changeType', params?.changeType?._id || null);
      formData.append('impact', params?.impact?._id || null);
      formData.append('priority', params?.priority?._id || null);
      formData.append('status', params?.status?._id || null);
      formData.append('changeReason', params?.changeReason?._id || null);
      formData.append('investigationReason', params?.investigationReason?._id || null);
      formData.append('implementationPlan', params?.implementationPlan || '');
      formData.append('backoutPlan', params?.backoutPlan || '');
      formData.append('testPlan', params?.testPlan || '');
      formData.append('shareWith', params?.shareWith );
      formData.append('isActive', params?.isActive );
      formData.append('rootCause', params?.rootCause || '');
      formData.append('workaround', params?.workaround || '');

      (params?.files || []).forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/${id}`, formData);

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

export function deleteTicketFile( ticketId, id ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`${CONFIG.SERVER_URL}tickets/${ticketId}/files/${id}`, { isActive: false, isArchived: true, });
      await dispatch(slice.actions.deleteTicketFileSuccess({ _id: id }));
      } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
