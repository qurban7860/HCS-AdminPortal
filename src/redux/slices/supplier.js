import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  supplierEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  suppliers: [],
  supplier: {},
  supplierParams: {

  }
};

const slice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setMachineEditFormVisibility(state, action){
      console.log('toggle', action.payload);
      state.supplierEditFormFlag = action.payload;
    },
    
    // RESET CUSTOMER
    resetMachine(state){
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
    getSuppliersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.suppliers = action.payload;
      state.initial = true;
    },

    // GET Customer
    getMachineSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.machine = action.payload;
      state.initial = true;
      console.log('machinesuccessslice', state.machine);
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
  setMachineEditFormVisibility,
  resetMachine,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;


// ----------------------------------------------------------------------

export function createSuppliers (supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    console.log(supplyData)
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}machines/suppliers`,supplyData);
      // dispatch(slice.actions)
      console.log(response,"From supplyer data");
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e))
    }
  }
}

// ----------------------------------------------------------------------


export function getSuppliers (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}machines/suppliers`);

      dispatch(slice.actions.getSuppliersSuccess(response.data));
      // dispatch(slice.actions)
      console.log(response,"From supplyer data");
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error))
    }
  }
}