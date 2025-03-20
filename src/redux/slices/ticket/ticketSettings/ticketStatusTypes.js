import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticketStatusType: null,
  ticketStatusTypes: [],
  activeTicketStatusTypes: [],
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
  name: 'ticketStatusTypes',
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
    getTicketStatusTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatusTypes = action.payload;
      state.initial = true;
    },
    
    // GET Tickets Success
    getReportTicketStatusTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatusTypes = action.payload;
      state.initial = true;
    },

    // GET  Active Tickets Success
    getActiveTicketStatusTypesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeTicketStatusTypes = action.payload;
      state.initial = true;
    },

    // GET Ticket Success
    getTicketStatusTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatusType = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketStatusTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatusType = action.payload;
      state.responseMessage = 'Ticket created successfully';
    },
    
    patchTicketStatusTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatusType = action.payload;
      state.responseMessage = 'Ticket updated successfully.';
    },

    deleteTicketStatusTypeSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketStatusTypes = state.ticketStatusTypes.filter((ticketStatusType) => ticketStatusType._id !== action.payload);
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
    resetTicketStatusType(state) {
      state.ticketStatusType = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTicketStatusTypes(state) {
      state.ticketStatusTypes = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Active Tickets
    resetActiveTicketStatusTypes(state) {
      state.activeTicketStatusTypes = [];
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
  resetTicketStatusType,
  resetTicketStatusTypes,
  resetActiveTicketStatusTypes,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicketStatusType(params) {
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
            isResolved: params.isResolved,
            isDefault: params.isDefault,
            isActive: params.isActive,
        };
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/settings/statusTypes/`, data);
      dispatch(slice.actions.postTicketStatusTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicketStatusType(id, params) {
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
          isResolved: params.isResolved,
          isDefault: params.isDefault,
          isActive: params.isActive,
        };
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/statusTypes/${id}`, data);
      dispatch(slice.actions.patchTicketStatusTypeSuccess(response.data)); 
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTicketStatusTypes(page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false,
      };

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/statusTypes`, { params });
      dispatch(slice.actions.getTicketStatusTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getReportTicketStatusTypes(value = null, unit = null) {
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

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/statusTypes/count`, { params });
      dispatch(slice.actions.getReportTicketStatusTypesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicketStatusType(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/statusTypes/${id}`);
      dispatch(slice.actions.getTicketStatusTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getActiveTicketStatusTypes ( cancelToken ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings/statusTypes`, 
      {
        params: {
          isArchived: false,
          isActive: true,
        },
        cancelToken: cancelToken?.token,
      });
      dispatch(slice.actions.getActiveTicketStatusTypesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('statuses loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// Archive Ticket
export function deleteTicketStatusType(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/settings/statusTypes/${id}`, data);
      dispatch(slice.actions.deleteTicketStatusTypeSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}
