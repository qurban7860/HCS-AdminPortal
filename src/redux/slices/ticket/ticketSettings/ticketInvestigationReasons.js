import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketInvestigationReason: null,
  ticketInvestigationReasons: [],
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
  name: 'ticketInvestigationReasons',
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
    getTicketInvestigationReasonsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketInvestigationReasons = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketInvestigationReasonSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketInvestigationReason = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketInvestigationReasonSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketInvestigationReason = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    patchTicketInvestigationReasonSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketInvestigationReason = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
    },

    deleteTicketInvestigationReasonSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketInvestigationReasons = state.ticketInvestigationReasons.filter((ticketInvestigationReason) => ticketInvestigationReason._id !== action.payload);
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
    resetTicketInvestigationReason(state) {
      state.ticketInvestigationReason = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTicketInvestigationReasons(state) {
      state.ticketInvestigationReasons = [];
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
  resetTicketInvestigationReason,
  resetTicketInvestigationReasons,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicketInvestigationReason(params) {
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
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/settings/investigationReasons/`, data);
      dispatch(slice.actions.postTicketInvestigationReasonSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicketInvestigationReason(id, params) {
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
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/investigationReasons/${id}`, data);
      dispatch(slice.actions.patchTicketInvestigationReasonSuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTicketInvestigationReasons(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false,
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/investigationReasons`, { params });
      dispatch(slice.actions.getTicketInvestigationReasonsSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicketInvestigationReason(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/investigationReasons/${id}`);
      dispatch(slice.actions.getTicketInvestigationReasonSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// DELETE Ticket
export function deleteTicketInvestigationReason(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/investigationReasons/${id}`, data);
      dispatch(slice.actions.deleteTicketInvestigationReasonSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

