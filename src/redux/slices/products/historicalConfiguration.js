import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  historicalConfigurationViewFormFlag: false,
  historicalConfigurationAddFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  historicalConfiguration: {},
  historicalConfigurations: [],
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
      state.historicalConfigurationAddFormFlag = false
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

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET MACHINE TECH PARAM
    resetHistoricalConfigurationRecord(state){
      state.historicalConfiguration = {};
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
  setAllFlagFalse,
  resetHistoricalConfigurationRecords,
  resetHistoricalConfigurationRecord,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ------------------------------------------------------------------------------------------------

export function getHistoricalConfigurationRecords (machineId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/productConfigurations/`, 
      {
        params: {
          isArchived: false,
          machine: machineId
        }
      }
      );
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
      const response = await axios.get(`${CONFIG.SERVER_URL}products/productConfigurations/${id}`,
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

export function addHistoricalConfigurationRecord( params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`${CONFIG.SERVER_URL}products/productConfigurations/`,params );
      dispatch(slice.actions.setResponseMessage(response?.data || ''));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
