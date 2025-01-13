import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketPriority: null,
  ticketPriorities: [],
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
  name: 'ticketPriorities',
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
    getTicketPrioritiesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketPriorities = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketPrioritySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketPriority = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketPrioritySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketPriority = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    patchTicketPrioritySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketPriority = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
    },

    deleteTicketPrioritySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketPriorities = state.ticketPriorities.filter((ticketPriority) => ticketPriority._id !== action.payload);
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
    resetTicketPriority(state) {
      state.ticketPriority = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTicketPriorities(state) {
      state.ticketPriorities = [];
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
  resetTicketPriority,
  resetTicketPriorities,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicketPriority(params) {
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
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/settings/priorities/`, data);
      dispatch(slice.actions.postTicketPrioritySuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicketPriority(id, params) {
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
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/priorities/${id}`, data);
      dispatch(slice.actions.patchTicketPrioritySuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTicketPriorities(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/priorities`, { params });
      dispatch(slice.actions.getTicketPrioritiesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicketPriority(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/priorities/${id}`);
      dispatch(slice.actions.getTicketPrioritySuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// DELETE Ticket
export function deleteTicketPriority(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`${CONFIG.SERVER_URL}tickets/settings/priorities/${id}`);
      dispatch(slice.actions.deleteTicketPrioritySuccess(id));
      dispatch(slice.actions.setResponseMessage('Ticket deleted successfully.'));
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}
