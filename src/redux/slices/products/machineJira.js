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
  machineJira: {},
  machineJiras: [],
  machineJiraTotalCount: 0,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  totalRows: 0,
};

const slice = createSlice({
  name: 'machineJira',
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
    getMachineJiraRecordSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineJira = action.payload;
      state.initial = true;
    },
    // GET MACHINE LOGS
    getMachineJiraRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineJiras = action.payload;
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
    resetMachineJiraRecord(state){
      state.machineJira = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET MACHINE TECH PARAM
    resetMachineJiraRecords(state){
      state.machineJiras = [];
      state.responseMessage = null;
      state.success = false;
      state.machineJiraTotalCount = 0;
      // state.isLoading = false;
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
  resetMachineJiraRecord,
  resetMachineJiraRecords,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;


// -------------------------- GET RECORD ----------------------------------------------------------------------

export function getMachineJira(machineId, page, pageSize ) {
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const params= {
        machine: machineId,

      }
      params.pagination = {
        page,
        pageSize  
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/erp/`, { params } );
      dispatch(slice.actions.getMachineJiraRecordSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// -------------------------- GET RECORD'S ----------------------------------------------------------------------

export function getMachineJiras(serialNo, page, pageSize ) {
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const params= {
        serialNo,
      }
      
      if(pageSize){
        params.maxResults = pageSize;
      }

      if(page && pageSize){
        params.startAt = page * pageSize;
      }
      
      const response = await axios.get(`${CONFIG.SERVER_URL}jira/tickets`, { params } );
      dispatch(slice.actions.getMachineJiraRecordsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}
