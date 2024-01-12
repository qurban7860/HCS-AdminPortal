import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  machineErpLogViewForm: false,
  machineErpLogListViewForm: false,
  machineErpLogAddForm: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machineErpLog: {},
  machineErpLogs: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machineErpLogs',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // SET ADD TOGGLE
    setMachineErpLogAddFormVisibility(state, action){
      state.machineErpLogAddForm = action.payload;
      state.machineErpLogListViewForm = false;
      state.machineErpLogViewForm = false;
    },
    // SET VIEW TOGGLE
    setMachineErpLogViewFormVisibility(state, action){
      state.machineErpLogViewForm = action.payload;
      state.machineErpLogListViewForm = false;
      state.machineErpLogAddForm = false;
    },
    // SET MACHINE GRAPH VIEW TOGGLE
    setMachineErpLogListViewFormVisibility(state, action){
      state.machineErpLogListViewForm = action.payload;
      state.machineErpLogViewForm = false;
      state.machineErpLogAddForm = false;
      
    },
    // SET VIEW TOGGLE
    setAllVisibilityFalse(state, action){
      state.machineErpLogListViewForm = false;
      state.machineErpLogViewForm = false;
      state.machineErpLogAddForm = false;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    // GET MACHINE LOG
    getMachineErpLogRecordSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineErpLog = action.payload;
      state.initial = true;
    },
    // GET MACHINE LOGS
    getMachineErpLogRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineErpLogs = action.payload;
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
    resetMachineErpLogRecord(state){
      state.machineErpLog = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET MACHINE TECH PARAM
    resetMachineErpLogRecords(state){
      state.machineErpLogs = [];
      state.responseMessage = null;
      state.success = false;
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
  setMachineErpLogAddFormVisibility,
  setMachineErpLogViewFormVisibility,
  setMachineErpLogListViewFormVisibility,
  setAllVisibilityFalse,
  resetMachineErpLogRecords,
  resetMachineErpLogRecord,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ------------------------- ADD RECORD ---------------------------------------------

export function addMachineErpLogRecord( machine, customer, csvData) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      let response
      let data = {}
      if(Array.isArray(csvData)){
        data.machine = machine
        data.customer = customer
        data.csvData = csvData
        response = await axios.post(`${CONFIG.SERVER_URL}logs/erp/multi/`,data );
      }else if(Object.keys(csvData).length !== 0){
        data = csvData
        data.machine = machine
        data.customer = customer
        response = await axios.post(`${CONFIG.SERVER_URL}logs/erp/`,data );
      }
      dispatch(slice.actions.setResponseMessage(response?.data || ''));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------- GET RECORD -------------------------------------------

export function getMachineErpLogRecord(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/erp/${id}`,
      {
        params: {
          machine: machineId,
        }
      });
      dispatch(slice.actions.getMachineErpLogRecordSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -------------------------- GET RECORD'S ----------------------------------------------------------------------

export function getMachineErpLogRecords(machineId, fromDate, toDate) {
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/erp/`, 
      {
        params: {
          isArchived: false,
          machine: machineId,
          fromDate,
          toDate,
        }
      }
      );
      dispatch(slice.actions.getMachineErpLogRecordsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// -------------------------- GET ERP GRAPH ----------------------------------------------------------------------

// export function getMachineErpLogGraph(machineId){
//   return async (dispatch) =>{
//     dispatch(slice.actions.startLoading());
//     try{
//       const response = await axios.get(`${CONFIG.SERVER_URL}logs/erp/graph`, 
//       {
//         params: {
//           isArchived: false,
//           machine: machineId
//         }
//       }
//       );
//       dispatch(slice.actions.getMachineErpLogsRecordsSuccess(response.data));
//     } catch (error) {
//       console.log(error);
//       dispatch(slice.actions.hasError(error.Message));
//       throw error;
//     }
//   }
// }


// -------------------------- ADD MULTI ERP LOG'S ----------------------------------------------------------------------

// export function addMultiMachineErpLogs(machineId){
//   return async (dispatch) =>{
//     dispatch(slice.actions.startLoading());
//     try{
//       const response = await axios.post(`${CONFIG.SERVER_URL}logs/erp/multi/`, 
//       {
//         params: {
//           isArchived: false,
//           machine: machineId
//         }
//       }
//       );
//       dispatch(slice.actions.getMachineErpLogsRecordsSuccess(response.data));
//     } catch (error) {
//       console.log(error);
//       dispatch(slice.actions.hasError(error.Message));
//       throw error;
//     }
//   }
// }

// -------------------------- ADD MULTI ERP LOG'S ----------------------------------------------------------------------

// export function updateMachineErpLog(machineId, id){
//   return async (dispatch) =>{
//     dispatch(slice.actions.startLoading());
//     try{
//       const response = await axios.patch(`${CONFIG.SERVER_URL}logs/erp/${id}`, 
//       {
//         params: {
//           isArchived: false,
//           machine: machineId
//         }
//       }
//       );
//       dispatch(slice.actions.getMachineErpLogsRecordsSuccess(response.data));
//     } catch (error) {
//       console.log(error);
//       dispatch(slice.actions.hasError(error.Message));
//       throw error;
//     }
//   }
// }

