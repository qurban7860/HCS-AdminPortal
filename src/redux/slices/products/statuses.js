import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  intial: false,
  machinestatusEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machinestatus: {},
  machinestatuses: [],
};

const slice = createSlice({
  name: 'machinestatus',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setMachinestatusesEditFormVisibility(state, action){
      state.machinestatusEditFormFlag = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  STATUSES
    getMachinestatusesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinestatuses = action.payload;
      state.initial = true;
    },

    // GET STATUS
    getMachinestatusSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.machinestatus = action.payload;
      state.initial = true;
    },


    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET 
    resetMachineStatus(state){
      state.machinestatus = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET 
    resetMachineStatuses(state){
      state.machinestatuses = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setMachinestatusesEditFormVisibility,
  resetMachineStatus,
  resetMachineStatuses,
  setResponseMessage,
} = slice.actions;


// ----------------------------------------------------------------------


export function getMachinestatuses (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/statuses`);

      dispatch(slice.actions.getMachinestatusesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('statuses loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message))
    }
  }
}
// ----------------------------------------------------------------------
 
export function getMachineStatus(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/statuses/${id}`);
      dispatch(slice.actions.getMachinestatusSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

//----------------------------------------------------------------

export function deleteMachinestatus(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/statuses/${id}` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// --------------------------------------------------------------------------

export function addMachineStatus(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetMachineStatus());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          description: params.description,
          displayOrderNo: params.displayOrderNo,
          isActive: params.isActive,
          slug: params.slug,
        };
        /* eslint-enable */
        const response = await axios.post(`${CONFIG.SERVER_URL}products/statuses`, data);
        dispatch(slice.actions.getMachinestatusesSuccess(response.data.Machinestatus));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachinestatus(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const formData = new FormData();
      /* eslint-disable */
      let data = {
        name: params.name,
        displayOrderNo: params.displayOrderNo,
        description: params.description,
        isActive: params.isActive,
        slug: params.slug,
      };
     /* eslint-enable */
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/statuses/${Id}`,
        data
      );
      dispatch(getMachineStatus(Id));
      dispatch(slice.actions.setMachinestatusesEditFormVisibility(false));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };

}