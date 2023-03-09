import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  machinemodelEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machinemodels: [],
  machinemodel: {},
  machinemodelParams: {
  }
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
      console.log('toggle', action.payload);
      state.machinemodelEditFormFlag = action.payload;
    },
    
    // RESET CUSTOMER
    resetMachinemodel(state){
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
    getMachinemodelsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinemodels = action.payload;
      state.initial = true;
    },

    // GET Customer
    getMachinemodelSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      console.log("IM DONE",action.payload)
      state.machinemodel = action.payload;
      state.initial = true;
      console.log('statusSuccessSlice', state.machinestatus);
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
  setMachinemodelsEditFormVisibility,
  resetMachineModel,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;


// ----------------------------------------------------------------------

export function createMachinemodels (supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    console.log(supplyData)
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}machines/models`,supplyData);
      // dispatch(slice.actions)
      console.log(response,"From model data");
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e))
    }
  }
}

// ----------------------------------------------------------------------


export function getMachinemodels (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}machines/models`);

      dispatch(slice.actions.getMachinemodelsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('model loaded successfully'));
      // dispatch(slice.actions)
      console.log(response,"From model data");
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error))
    }
  }
}
// ----------------------------------------------------------------------
 
export function getMachineModel(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}machines/models/${id}`);
      console.log('slice working get model',response);
      dispatch(slice.actions.getMachinemodelSuccess(response.data));
      console.log('requested model', response.data);
    } catch (error) {
      console.error(error,"Slice Error");
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteMachinemodel(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id[0],'Delete model id xyzzzzzzz');
      const response = await axios.delete(`${CONFIG.SERVER_URL}machines/models/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      
      
      console.log(response);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// --------------------------------------------------------------------------

export function saveMachinemodel(params) {
    return async (dispatch) => {
      console.log('params', params);
      dispatch(slice.actions.resetMachinemodel());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
         
        };
        /* eslint-enable */
        if(params.description){
            data.description = params.description;
          }
          if(params.displayOrderNo){
            data.displayOrderNo = params.displayOrderNo;
          }
          if(params.categories){
            data.categories.name = params.categories;
          }
        const response = await axios.post(`${CONFIG.SERVER_URL}machines/models`, data);

        console.log('response', response.data.Machinemodel);
        dispatch(slice.actions.getMachinemodelsSuccess(response.data.Machinemodel));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachinemodel(params) {
  console.log('update, working', params)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const formData = new FormData();
      /* eslint-disable */
      let data = {
        id: params.id,
        name: params.name,
      };
     /* eslint-enable */
     if(params.description){
        data.description = params.description;
      }

      if(params.displayOrderNo){
        data.displayOrderNo = params.displayOrderNo;
      }
      if(params.categories){
        data.categories.name = params.categories;
      }
      
      
      const response = await axios.patch(`${CONFIG.SERVER_URL}machines/models/${params.id}`,
        data
      );
      console.log(response,"From update success")
      dispatch(getMachineModel(params.id));
      dispatch(slice.actions.setMachinemodelsEditFormVisibility(false));

    } catch (error) {
      console.error(error,"from model");
      dispatch(slice.actions.hasError(error));
    }
  };

}