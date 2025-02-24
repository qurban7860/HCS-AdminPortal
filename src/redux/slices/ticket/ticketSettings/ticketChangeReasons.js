import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketChangeReason: [],
  ticketChangeReasons: [],
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
  name: 'ticketChangeReasons',
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
    getTicketChangeReasonsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeReasons = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketChangeReasonSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeReason = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketChangeReasonSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeReason = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    patchTicketChangeReasonSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeReason = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
    },

    deleteTicketChangeReasonSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeReasons = state.ticketChangeReasons.filter((ticketChangeReason) => ticketChangeReason._id !== action.payload);
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
    resetTicketChangeReason(state) {
      state.ticketChangeReason = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTicketChangeReasons(state) {
      state.ticketChangeReasons = [];
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
  resetTicketChangeReason,
  resetTicketChangeReasons,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicketChangeReason(params) {
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
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/settings/changeReasons/`, data);
      dispatch(slice.actions.postTicketChangeReasonSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicketChangeReason(id, params) {
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
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/changeReasons/${id}`, data);
      dispatch(slice.actions.patchTicketChangeReasonSuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTicketChangeReasons(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false,
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/changeReasons`, { params });
      dispatch(slice.actions.getTicketChangeReasonsSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicketChangeReason(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/changeReasons/${id}`);
      dispatch(slice.actions.getTicketChangeReasonSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// Archive Ticket
export function deleteTicketChangeReason(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/changeReasons/${id}`, data);
      dispatch(slice.actions.deleteTicketChangeReasonSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

