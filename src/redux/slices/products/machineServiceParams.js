import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  machineServiceParamEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machineServiceParam: {},
  machineServiceParams: [],
  activeMachineServiceParams: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machineServiceParam',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setMachineServiceParamEditFormVisibility(state, action){
      state.techparamEditFormFlag = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET MACHINE SERVICE PARAM
    getMachineServiceParamsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceParams = action.payload;
      state.initial = true;
    },
    // GET MACHINE SERVICE PARAM
    getMachineServiceParamSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceParam = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getActiveMachineServiceParamsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeMachineServiceParams = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET MACHINE TECH PARAM
    resetMachineServiceParam(state){
      state.machineServiceParam = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM
    resetMachineServiceParams(state){
      state.machineServiceParams = [];
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
  setMachineServiceParamEditFormVisibility,
  getActiveMachineServiceParamsSuccess,
  resetMachineServiceParams,
  resetMachineServiceParam,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------
export function getActiveMachineServiceParams (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceParams`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      }
      );
      dispatch(slice.actions.getActiveMachineServiceParamsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Techparams loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------

export function getMachineServiceParams (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceParams`, 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getMachineServiceParamsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Techparams loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}


// ----------------------------------------------------------------------
export function getMachineServiceParam(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceParams/${id}`);
      dispatch(slice.actions.getMachineServiceParamSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteMachineServiceParam(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceParams/${id}` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function addMachineServiceParam(params) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        
        /* eslint-disable */
        let data = {
          name:             params?.name,
          printName:        params?.printName,
          helpHint:         params?.helpHint,
          linkToUserManual: params?.linkToUserManual,
          inputType:        params?.inputType,
          unitType:         params?.unitType,    
          minValidation:    params?.minValidation,
          maxValidation:    params?.maxValidation,
          description:      params?.description,
          isRequired:       params?.isRequired, 
          isActive:         params?.isActive,
        };
        const response = await axios.post(`${CONFIG.SERVER_URL}products/serviceParams`, data);
        dispatch(slice.actions.getMachineServiceParamSuccess(response.data.MachineTool));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachineServiceParam(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        name:             params?.name,
        printName:        params?.printName,
        helpHint:         params?.helpHint,
        linkToUserManual: params?.linkToUserManual,
        inputType:        params?.inputType,
        unitType:         params?.unitType,    
        minValidation:    params?.minValidation,
        maxValidation:    params?.maxValidation,
        description:      params?.description,
        isRequired:       params?.isRequired, 
        isActive:         params?.isActive,
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}products/serviceParams/${id}`,data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}