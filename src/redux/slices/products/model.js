import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const regEx = /^[2][0-9][0-9]$/
const initialState = {
  intial: false,
  machinemodelEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machineModels: [],
  activeMachineModels: [],
  machineModel: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machinemodel',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // SET TOGGLE
    setMachinemodelsEditFormVisibility(state, action){
      state.machinemodelEditFormFlag = action.payload;
    },
    

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  MODELS
    getMachineModelsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineModels = action.payload;
      state.initial = true;
    },

    // GET  ACTIVE MODELS
    getActiveMachineModelsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeMachineModels = action.payload;
      state.initial = true;
    },

        
    // GET MODEL
    getMachinemodelSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineModel = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET 
    resetMachineModel(state){
      state.machineModel = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET 
    resetMachineModels(state){
      state.machineModels = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET 
    resetActiveMachineModels(state){
      state.activeMachineModels = [];
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
  setMachinemodelsEditFormVisibility,
  resetMachineModel,
  resetMachineModels,
  resetActiveMachineModels,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;


// ----------------------------------------------------------------------

export function getMachineModels (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/models`, 
      {
        params: {
          isArchived: false
        }
      });
      if(regEx.test(response.status)){
        dispatch(slice.actions.getMachineModelsSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------- get Active Machine Models ---------------------------------------------

export function getActiveMachineModels (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/models`,
      {
        params: {
          isActive: true,
          isArchived: false
        }
      });
      if(regEx.test(response.status)){
        dispatch(slice.actions.getActiveMachineModelsSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------
 
export function getMachineModel(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/models/${id}`);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getMachinemodelSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
//----------------------------------------------------------------

export function deleteMachineModel(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      await axios.patch(`${CONFIG.SERVER_URL}products/models/${id}` , 
      {
          isArchived: true, 
      });
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function addMachineModel(params) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try{
        /* eslint-disable */
        let data = {
          name: params.name,
          isActive: params.isActive,
          description: params.description,
        };
        /* eslint-enable */
          if(params.category !== ""){
            data.category = params.category;
          }else{
            data.category = null
          }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/models`, data);
          return response
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
    };
}

// --------------------------------------------------------------------------

export function updateMachineModel(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      /* eslint-disable */
      let data = {
        name: params.name,
        isActive: params.isActive,
        description: params.description,
      };
     /* eslint-enable */
      if(params.category !== null && params.category !== undefined){
        data.category = params.category._id;
      }else{
        data.category = null
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/models/${Id}`,
        data
      );
      if(regEx.test(response.status)){
        dispatch(getMachineModel(Id));
        dispatch(slice.actions.setMachinemodelsEditFormVisibility(false));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}