import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketChangeType: null,
  ticketChangeTypes: [],
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
  name: 'ticketChangeTypes',
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
    getTicketChangeTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeTypes = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketChangeTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeType = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketChangeTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeType = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    patchTicketChangeTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeType = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
    },

    deleteTicketChangeTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketChangeTypes = state.ticketChangeTypes.filter((ticketChangeType) => ticketChangeType._id !== action.payload);
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
    resetTicketChangeType(state) {
      state.ticketChangeType = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTicketChangeTypes(state) {
      state.ticketChangeTypes = [];
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
  resetTicketChangeType,
  resetTicketChangeTypes,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicketChangeType(params) {
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
        };
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/settings/changeTypes/`, data);
      dispatch(slice.actions.postTicketChangeTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicketChangeType(id, params) {
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
        };
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/changeTypes/${id}`, data);
      dispatch(slice.actions.patchTicketChangeTypeSuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTicketChangeTypes(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false,
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/changeTypes`, { params });
      dispatch(slice.actions.getTicketChangeTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicketChangeType(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/changeTypes/${id}`);
      dispatch(slice.actions.getTicketChangeTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// Archive Ticket
export function deleteTicketChangeType(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/changeTypes/${id}`, data);
      dispatch(slice.actions.deleteTicketChangeTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function deleteTicketPriority(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/priorities/${id}`, data);
      dispatch(slice.actions.deleteTicketPrioritySuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}