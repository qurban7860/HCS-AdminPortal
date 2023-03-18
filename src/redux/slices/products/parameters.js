import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  techparamEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  techparams: [],
  techparam: {},
  techparamParams: {

  }
};

const slice = createSlice({
  name: 'techparam',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setTechparamEditFormVisibility(state, action){
      console.log('toggle', action.payload);
      state.techparamEditFormFlag = action.payload;
    },
  
    // RESET CUSTOMER
    resettechparam(state){
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
    getTechparamsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.techparams = action.payload;
      state.initial = true;
    },

    // GET Customer
    getTechparamSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.techparam = action.payload;
      state.initial = true;
      console.log('techparamSuccessSlice', state.techparam);
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
  setTechparamEditFormVisibility,
  resetTechparam,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;


// ----------------------------------------------------------------------

export function createTechparams (supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    console.log(supplyData)
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}products/techparams`,supplyData);
      // dispatch(slice.actions)
      console.log(response,"From techparam data");
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e))
    }
  }
}

// ----------------------------------------------------------------------


export function getTechparams (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/techparams`);

      dispatch(slice.actions.getTechparamsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Techparams loaded successfully'));
      // dispatch(slice.actions)
      console.log(response,"From techparams data");
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error))
    }
  }
}
// ----------------------------------------------------------------------

export function getTechparam(id) {
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/techparams/${id}`);
      console.log('Response',response.data)
      dispatch(slice.actions.getTechparamSuccess(response.data));
      console.log('requested techparams', response.data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteTechparams(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id[0],'Delete techparams id xyzzzzzzz');
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/techparams/${id}`);
     
      dispatch(slice.actions.setResponseMessage(response.data));
      
      
      console.log(response);
      // console.log(CONFIG.SERVER_URL[0])
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// --------------------------------------------------------------------------

export function saveTechparam(params) {
    return async (dispatch) => {
      console.log('params', params);
      dispatch(slice.actions.resetTechparam());
      dispatch(slice.actions.startLoading());
      try {
        
        /* eslint-disable */
        let data = {
          name: params.name,
          isDisabled: !(params.isDisabled),
        };
        /* eslint-enable */
        if(params.description){
            data.description = params.description;
          }
          if(params.code){
            data.code = params.code;
          }

          if(params.techparamcategory !== ""){
            data.techparamcategory = params.techparamcategory._id;
          }else{
            data.techparamcategory = null
          }
        
        const response = await axios.post(`${CONFIG.SERVER_URL}products/techparams`, data);

        console.log('response', response.data.Techparam);
        dispatch(slice.actions.getTechparamsSuccess(response.data.Techparam));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }
    };

}

// --------------------------------------------------------------------------

export function updateTechparam(params) {
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
      if(params.isDisabled){
        data.isDisabled = params.isDisabled;
      }
      if(params.code){
        data.code = params.code;
      }
      if(params.techparamcategory !== ""){
        data.techparamcategory = params.techparamcategory._id;
      }else{
        data.techparamcategory = null
      }
      
      
      
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/techparams/${params.id}`,
        data
      );

      dispatch(getTechparams(params.id));
      dispatch(slice.actions.setTechparamEditFormVisibility(false));

      // this.updateCustomerSuccess(response);

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };

}