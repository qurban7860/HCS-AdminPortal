import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  machinestatusEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machinestatuses: [],
  machinestatus: {},
  machinestatusParams: {
  }
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
    
    // RESET CUSTOMER
    resetMachinestatus(state){
      state.machine = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;

    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Customers
    getMachinestatusesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinestatuses = action.payload;
      state.initial = true;
    },

    // GET Customer
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


    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setMachinestatusesEditFormVisibility,
  resetMachineStatus,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

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
      console.error(error,"Slice Error");
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

//----------------------------------------------------------------

export function deleteMachinestatus(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/statuses/${id}`);
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
      dispatch(slice.actions.resetMachinestatus());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          description: params.description,
          displayOrderNo: params.displayOrderNo,
          isActive: params.isActive,
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
        isActive: params.isActive
      };
     /* eslint-enable */
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/statuses/${Id}`,
        data
      );
      dispatch(getMachineStatus(Id));
      dispatch(slice.actions.setMachinestatusesEditFormVisibility(false));
    } catch (error) {
      console.error(error,"from statuses");
      dispatch(slice.actions.hasError(error.Message));
    }
  };

}