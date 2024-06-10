import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';
import { fDate } from '../../../utils/formatTime';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  jiraTicket: {},
  jiraTickets: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  totalRows: 0,
  filterStatus: 'Open',
  filterPeriod: 3,
};

const slice = createSlice({
  name: 'jira',
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
    
    // SET FILTER STATUS
    setFilterStatus(state, action){
      state.filterStatus = action.payload;
    },

    // SET FILTER PERIOD
    setFilterPeriod(state, action){
      state.filterPeriod = action.payload;
    },


    // GET JiraTickets
    getJiraTicketsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.jiraTickets = action.payload;
      state.totalRows = action.payload?.total;
      state.initial = true;
    },
    // GET JiraTicket
    getJiraTicketSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.jiraTicket = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET SECURITY USER
    resetJiraTicket(state){
      state.jiraTicket = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SECURITY USERS
    resetJiraTickets(state){
      state.jiraTickets = [];
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
  resetJiraTicket,
  resetJiraTickets,
  setFilterBy,
  setFilterStatus,
  setFilterPeriod,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getJiraTickets(period) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 

      const params = {};
      if(period){
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth()-period);
        params.startDate = fDate(startDate, 'yyyy-MM-dd');
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}jira/tickets`,{params});
      if(regEx.test(response.status)){
        dispatch(slice.actions.getJiraTicketsSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getJiraTicket(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}jira/${id}`);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getJiraTicketSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
