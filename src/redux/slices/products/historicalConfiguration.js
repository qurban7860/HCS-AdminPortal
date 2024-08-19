import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  historicalConfigurationViewFormFlag: false,
  historicalConfigurationCompareViewFormFlag: false,
  historicalConfigurationAddFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  historicalConfiguration: {},
  historicalConfigurations: [],
  historicalConfigurationCompare: {},
  selectedINIs:[],
  isHistorical: false,
  isDetailPage: false,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'historicalConfiguration',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET ADD TOGGLE
    setHistoricalConfigurationAddFormVisibility(state, action){
      state.historicalConfigurationAddFormFlag = action.payload;
      state.historicalConfigurationViewFormFlag = false;
    },

    // SET VIEW TOGGLE
    setHistoricalConfigurationViewFormVisibility(state, action){
      state.historicalConfigurationViewFormFlag = action.payload;
      state.historicalConfigurationAddFormFlag = false;
    },

    // SET VIEW TOGGLE
    setHistoricalConfigurationCompareViewFormVisibility(state, action){
      state.historicalConfigurationCompareViewFormFlag = action.payload;
      state.historicalConfigurationViewFormFlag = false;
      state.historicalConfigurationAddFormFlag = false;
    },

    // SET VIEW TOGGLE
    setAllVisibilityFalse(state, action){
      state.historicalConfigurationCompareViewFormFlag = false;
      state.historicalConfigurationViewFormFlag = false;
      state.historicalConfigurationAddFormFlag = false;
    },

    // SET ALL TOGGLE
    setAllFlagFalse(state, action){
      state.historicalConfigurationViewFormFlag = false;
      state.historicalConfigurationAddFormFlag = false
    },

        
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET MACHINE SERVICE PARAM
    getHistoricalConfigurationRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.historicalConfigurations = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getHistoricalConfigurationRecordSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.historicalConfiguration = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getHistoricalConfigurationRecordCompareSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.historicalConfigurationCompare = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    setSelectedINIs(state, action) {
      state.selectedINIs = action.payload;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET MACHINE TECH PARAM
    resetHistoricalConfigurationRecord(state){
      state.historicalConfiguration = null;
      state.historicalConfigurationCompare = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM
    resetHistoricalConfigurationRecords(state){
      state.historicalConfigurations = [];
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
  setHistoricalConfigurationAddFormVisibility,
  setHistoricalConfigurationViewFormVisibility,
  setHistoricalConfigurationCompareViewFormVisibility,
  setAllVisibilityFalse,
  setAllFlagFalse,
  resetHistoricalConfigurationRecords,
  resetHistoricalConfigurationRecord,
  setSelectedINIs,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ------------------------------------------------------------------------------------------------

export function getHistoricalConfigurationRecords ( machineId, isMachineArchived ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const params = {
        isArchived: false,
        machine: machineId,
        orderBy : {
          createdAt: -1
        }
      }
    if( isMachineArchived ){
      params.archivedByMachine = true;
      params.isArchived = true;
    } 
      const response = await axios.get(`${CONFIG.SERVER_URL}apiclient/productConfigurations/`, { params } );
      dispatch(slice.actions.getHistoricalConfigurationRecordsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getHistoricalConfigurationRecord(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // await dispatch(resetHistoricalConfigurationRecord());
      const response = await axios.get(`${CONFIG.SERVER_URL}apiclient/productConfigurations/${id}`,
      {
        params: {
          machine: machineId,
        }
      });
      dispatch(slice.actions.getHistoricalConfigurationRecordSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ----------------------------------------------------------------------

export function getHistoricalConfigurationRecordCompare(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}apiclient/productConfigurations/${id}`,
      {
        params: {
          machine: machineId,
        }
      });
      dispatch(slice.actions.getHistoricalConfigurationRecordCompareSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ----------------------------------------------------------------------

export function addHistoricalConfigurationRecord( params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
          backupDate: params.backupDate,
          configuration: params.configuration,
          inputGUID: params.inputGUID,
          inputSerialNo: params.inputSerialNo,
          isManufacture: params.isManufacture,
        }
      const response = await axios.post(`${CONFIG.SERVER_URL}apiclient/productConfigurations/`, data );
      dispatch(slice.actions.setResponseMessage(response?.data || ''));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
