import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  machinemodelEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machineModels: [],
  machineModel: {},
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
    getMachineModelsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineModels = action.payload;
      state.initial = true;
    },

    // GET Customer
    getMachinemodelSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machinemodel = action.payload;
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

export function getMachineModels (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/models`);
      dispatch(slice.actions.getMachineModelsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('model loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message))
    }
  }
}

// ----------------------------------------------------------------------
 
export function getMachineModel(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/models/${id}`);
      dispatch(slice.actions.getMachinemodelSuccess(response.data));
    } catch (error) {
      console.error(error,"Slice Error");
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}
//----------------------------------------------------------------

export function deleteMachineModel(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/models/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// --------------------------------------------------------------------------

export function addMachineModel(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetMachinemodel());
      dispatch(slice.actions.startLoading());
      try {
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
          console.log("data : ",data);
        const response = await axios.post(`${CONFIG.SERVER_URL}products/models`, data);
        dispatch(slice.actions.getMachineModelsSuccess(response.data.Machinemodel));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
      }
    };
}

// --------------------------------------------------------------------------

export function updateMachineModel(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      /* eslint-disable */
      let data = {
        id: params.id,
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
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/models/${params.id}`,
        data
      );
      dispatch(getMachineModel(params.id));
      dispatch(slice.actions.setMachinemodelsEditFormVisibility(false));
    } catch (error) {
      console.error(error,"from model");
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}