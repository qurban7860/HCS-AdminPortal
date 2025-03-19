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
  machineLogsGraphData: [],
  machineErpLogstotalCount: 0,
  dateFrom: new Date( Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dateTo: new Date(Date.now()).toISOString().split('T')[0],
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
    // SET ERP LOG FROM DATE
    setDateFrom(state, action){
      state.dateFrom = action.payload;
    },
    // SET ERP LOG TO DATE
    setDateTo(state, action){
      state.dateTo = action.payload;
    },
    // SET LOG TYPE
    setSelectedLogType(state, action){
      state.selectedLogType = action.payload;
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
      state.machineErpLogstotalCount = action?.payload?.totalCount;
      state.initial = true;
    },
    // RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    // LOGS GRAPH DATA
    setMachineLogsGraphData(state, action) {
      state.machineLogsGraphData = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    // RESET GRAPH DATA
    resetMachineLogsGraphData(state){
      state.machineLogsGraphData = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
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
      state.machineErpLogstotalCount = 0;
      // state.isLoading = false;
    },
    // RESET MACHINE LOG DATES
    resetMachineErpLogDates(state){
      state.dateFrom = new Date( Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      state.dateTo = new Date(Date.now()).toISOString().split('T')[0];
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
  setDateFrom,
  setSelectedLogType,
  setDateTo,
  setAllVisibilityFalse,
  resetMachineErpLogRecords,
  resetMachineErpLogRecord,
  resetMachineLogsGraphData,
  resetMachineErpLogDates,
  setResponseMessage,
  setMachineLogsGraphData,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage
} = slice.actions;

// ------------------------- ADD RECORD ---------------------------------------------

export function addMachineLogRecord(machine, customer, logs, action, version, type = "ERP") {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        type,
        customer,
        machine,
        version,
        skip: action?.skipExistingRecords,
        update: action?.updateExistingRecords,
        logs: [...logs],
      };
      const response = await axios.post(`${CONFIG.SERVER_URL}productLogs/`, data);
      dispatch(slice.actions.setResponseMessage(response?.data || ''));
      return {
        success: true,
        message: 'Successfully added',
      };
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      return {
        success: false,
        message: error || "Something went wrong",
      };
    }
  };
}

// ------------------------- GET LOGS GRAPH DATA ---------------------------------------------

export function getMachineLogGraphData(customerId, machineId, type = "erp", periodType, logGraphType) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        customer: customerId,
        machine: machineId,
        type,
        periodType,
        logGraphType
      };
      const response = await axios.get(`${CONFIG.SERVER_URL}productLogs/graph`, { params });
      dispatch(slice.actions.setMachineLogsGraphData(response?.data || ''));
      return {
        success: true,
        message: 'Graph Data Successfully fetched',
      };
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.message || 'Something went wrong'));
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };
}


// --------------------------- GET RECORD -------------------------------------------

export function getMachineLogRecord(machineId, id, logType) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}productLogs/${id}`,
      {
        params: {
          type: logType,
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

// --------------------------- UPDATE RECORD -------------------------------------------

export function updateMachineLogRecord(id, logType, logData) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        type: logType,
        ...logData
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}productLogs/${id}`, data);
      dispatch(slice.actions.getMachineErpLogRecordSuccess(response.data));
      return {
        success: response.status === 202,
        message: 'Successfully updated',
      };
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------- DELETE RECORD -------------------------------------------

export function deleteMachineLogRecord(id, logType) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}productLogs/${id}`,
      {
        params: {
          type: logType
        }
      });
      dispatch(slice.actions.setResponseMessage(response.data));
      return {
        success: response.status === 200,
        message: 'Deleted Successfully',
      };
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -------------------------- GET RECORD'S ----------------------------------------------------------------------

export function getMachineLogRecords({
  customerId = undefined,
  machineId,
  page,
  pageSize,
  fromDate,
  toDate,
  isCreatedAt,
  isMachineArchived,
  selectedLogType,
  isArchived,
  searchKey,
  searchColumn,
}) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        customer: customerId,
        type: selectedLogType,
        machine: machineId,
        fromDate,
        toDate,
        isArchived,
        pagination: { page, pageSize },
        ...(isMachineArchived && { archivedByMachine: true }),
        ...(!!isCreatedAt && { isCreatedAt }),
        ...(searchKey?.length > 0 && { searchKey, searchColumn })
      };
      const response = await axios.get(`${CONFIG.SERVER_URL}productLogs/`, { params });
      dispatch(slice.actions.getMachineErpLogRecordsSuccess(response.data));
    } catch (error) {
      console.error('Error fetching machine log records:', error);
      dispatch(slice.actions.hasError(error.message || 'An error occurred'));
      throw error;
    }
  };
}

// -------------------------- GET LOGS BY API ID ----------------------------------------------------------------------

export function getMachineLogsByApiId(apiId, logType) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        apiId,
        type: logType
      };
      const response = await axios.get(`${CONFIG.SERVER_URL}productLogs/logsByApiId`, { params });
      dispatch(slice.actions.getMachineErpLogRecordsSuccess(response.data));
      return {
        success: true,
        message: 'Logs successfully fetched',
      };
    } catch (error) {
      console.error('Error fetching logs by API ID:', error);
      dispatch(slice.actions.hasError(error.message || 'An error occurred'));
      return {
        success: false,
        message: error.message || 'Something went wrong',
      };
    }
  };
}


