import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  customerJira: {},
  customerJiras: [],
  customerJiraTotalCount: 0,
  filterBy: '',
  filterStatus: 'Open',
  page: 0,
  rowsPerPage: 100,
  totalRows: 0,
};

const slice = createSlice({
  name: 'customerJira',
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
    // GET MACHINE LOG
    getCustomerJiraRecordSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customerJira = action.payload;
      state.initial = true;
    },
    // GET MACHINE LOGS
    getCustomerJiraRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customerJiras = action.payload;
      state.totalRows = action.payload.total;
      state.initial = true;
    },
    // RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    // RESET MACHINE TECH PARAM
    resetCustomerJiraRecord(state){
      state.customerJira = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET MACHINE TECH PARAM
    resetCustomerJiraRecords(state){
      state.customerJiras = [];
      state.responseMessage = null;
      state.success = false;
      state.customerJiraTotalCount = 0;
      // state.isLoading = false;
    },
    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },

    // SET FILTER STATUS
    setFilterStatus(state, action){
      state.filterStatus = action.payload;
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
  resetCustomerJiraRecord,
  resetCustomerJiraRecords,
  setResponseMessage,
  setFilterBy,
  setFilterStatus,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;


// -------------------------- GET RECORD ----------------------------------------------------------------------

export function getCustomerJira(ref, page, pageSize ) {
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const params= {
        ref,
      }
      params.pagination = {
        page,
        pageSize  
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/erp/`, { params } );
      dispatch(slice.actions.getCustomerJiraRecordSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// -------------------------- GET RECORD'S ----------------------------------------------------------------------

export function getCustomerJiras(ref) {
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const params= {
        ref,
        startAt:0
      }
      
      const response = await axios.get(`${CONFIG.SERVER_URL}/jira/tickets`, { params } );
      dispatch(slice.actions.getCustomerJiraRecordsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}
