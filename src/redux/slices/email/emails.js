import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  email: {},
  emails: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  initial: false,
  error: null,
  success: false,
  isLoading: false,
  responseMessage: null,
  reportHiddenColumns: {
    "toEmails": false,
    "fromEmail": true,
    "subject": false,
    "customer.name": false,
    "createdAt": false,
},
};

const slice = createSlice({
  name: 'emails',
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


    // GET EMAILS
    getEmailsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.emails = action.payload;
      state.initial = true;
    },

    getEmailSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.email = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET EMAILS
    resetEmail(state){
      state.email = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET EMAILS
    resetEmails(state){
      state.emails = [];
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
    setReportHiddenColumns(state, action){
      state.reportHiddenColumns = action.payload;  
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetEmail,
  resetEmails,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns,
} = slice.actions;


// ----------------------------------------------------------------------

export function getEmails(page, pageSize ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
        const params= {
            orderBy : { createdAt: -1 },
            pagination:{ page, pageSize } 
          }

      const response = await axios.get(`${CONFIG.SERVER_URL}emails`, { params });
        dispatch(slice.actions.getEmailsSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  }
}


// ----------------------------------------------------------------------

export function getEmail(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}emails/${id}`);
        dispatch(slice.actions.getEmailSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  };
}


