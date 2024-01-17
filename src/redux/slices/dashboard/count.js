import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  count: {},
  machinesByCountry:[],
  machinesByModel:[],
  machinesByYear:[],
  machineCategory:null,
  machineModel:null,
  machineCountry:null,
  machineYear:null,
  erpLogs:[],
};

const slice = createSlice({
  name: 'count',
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
    // RESET USERS
    resetCount(state){
      state.count = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // GET users
    getCountSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.count = action.payload;
      state.initial = true;
    },

    // GET Machine by Countries Success
    getMachinesByCountrySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinesByCountry = action.payload;
      state.initial = true;
    },

    // GET Machine by Models Success
    getMachinesByModelSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinesByModel = action.payload;
      state.initial = true;
    },

    // GET Machine by Years Success
    getMachinesByYearSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinesByYear = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    // SET CategoryID
    setMachineCategory(state, action) {
      state.machineCategory = action.payload;
    },
    // SET Model ID
    setMachineModel(state, action) {
      state.machineModel = action.payload;
    },
    // SET Country Code
    setMachineCountry(state, action) {
      state.machineCountry = action.payload;
    },
    // SET Year
    setMachineYear(state, action) {
      state.machineYear = action.payload;
    },

    // GET ERP Logs
    getERPLogsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.erpLogs = action.payload;
      state.initial = true;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetCounts,
  setMachineCategory,
  setMachineModel,
  setMachineCountry,
  setMachineYear
} = slice.actions;

// ----------------------------------------------------------------------

export function getCount() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dashboard/`);
      dispatch(slice.actions.getCountSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function getMachinesByCountry(category, year, model, allRecords) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dashboard/machineCountries?category=${category}&year=${year}&model=${model}&allRecords=${allRecords}`);
      dispatch(slice.actions.getMachinesByCountrySuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function getMachinesByModel(category, year, country, allRecords) {
  return async (dispatch) => {
    console.log("allRecords : ",allRecords)
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dashboard/machineModel?category=${category}&year=${year}&country=${country}&allRecords=${allRecords}`);
      dispatch(slice.actions.getMachinesByModelSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function getMachinesByYear(category, model, country, allRecords ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}dashboard/machineYear?category=${category}&model=${model}&country=${country}&allRecords=${allRecords}`);
      dispatch(slice.actions.getMachinesByYearSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function getERPLogs(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}logs/erp/graph`, 
      {
        params: {machine: machineId}
      });

      dispatch(slice.actions.getERPLogsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}
