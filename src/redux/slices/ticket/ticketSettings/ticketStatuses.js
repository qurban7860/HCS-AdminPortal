import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketStatus: null,
  ticketStatuses: [],
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
          icon: params.icon,
          slug: params.slug,
          displayOrderNo: params.displayOrderNo,
          description: params.description,
          isDefault: params.isDefault,
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
          icon: params.icon,
          slug: params.slug,
          displayOrderNo: params.displayOrderNo,
          description: params.description,
          isDefault: params.isDefault,
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

// DELETE Ticket
export function deleteTicketStatus(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`${CONFIG.SERVER_URL}tickets/settings/statuses/${id}`);
      dispatch(slice.actions.deleteTicketStatusSuccess(id));
      dispatch(slice.actions.setResponseMessage('Ticket deleted successfully.'));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}
