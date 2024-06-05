import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

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
  filterStatus: 'open',
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
    
    // SET EMPLOYEE RESTRICTED LIST
    setFilterStatus(state, action){
      state.filterStatus = action.payload;
    },

    // GET JiraTickets
    getJiraTicketsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.jiraTickets = action.payload;
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
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getJiraTickets(pageSize, status) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}jira/tickets?startAt=0&maxResults=${pageSize}&state`,
      {
        params: {
          status
        }
      }
      );
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
