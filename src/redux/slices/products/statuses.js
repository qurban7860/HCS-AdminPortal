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

export function createMachinestatuses (supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}products/statuses`,supplyData);
      // dispatch(slice.actions)
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e.Message))
    }
  }
}

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

export function saveMachinestatus(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetMachinestatus());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          isDisabled: params?.isDisabled,
         
        };
        /* eslint-enable */
        if(params.description){
            data.description = params.description;
          }
          if(params.displayOrderNo){
            data.displayOrderNo = params.displayOrderNo;
          }
        
        const response = await axios.post(`${CONFIG.SERVER_URL}products/statuses`, data);

        dispatch(slice.actions.getMachinestatusesSuccess(response.data.Machinestatus));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachinestatus(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const formData = new FormData();
      /* eslint-disable */
      let data = {
        id: params.id,
        name: params.name,
        // tradingName: params.tradingName
      };
     /* eslint-enable */
     if(params.description){
        data.description = params.description;
      }
      if(params.isDisabled){
        data.isDisabled = params.isDisabled;
      }

      if(params.displayOrderNo){
        data.displayOrderNo = params.displayOrderNo;
      }
      
      
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/statuses/${params.id}`,
        data
      );
      dispatch(getMachineStatus(params.id));
      dispatch(slice.actions.setMachinestatusesEditFormVisibility(false));
    } catch (error) {
      console.error(error,"from statuses");
      dispatch(slice.actions.hasError(error.Message));
    }
  };

}