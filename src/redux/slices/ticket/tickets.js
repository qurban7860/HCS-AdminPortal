import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticket: {},
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


    // GET Ticket
    getTicketsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.tickets = action.payload;
      state.initial = true;
    },

    getTicketSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticket = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET Ticket
    resetTicket(state){
      state.ticket = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTickets(state){
      state.tickets = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
        // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
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

export function getTickets(page, pageSize ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
        const params= {
            orderBy : { createdAt: -1 },
            pagination:{ page, pageSize } 
        }

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets`, { params });
        dispatch(slice.actions.getTicketsSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  }
}


// ----------------------------------------------------------------------

export function getTicket(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}ticket/${id}`);
        dispatch(slice.actions.getTicketSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  };
}


