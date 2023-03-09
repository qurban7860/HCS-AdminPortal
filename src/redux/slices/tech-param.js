import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  techparamEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  techparamcategories: [],
  techparamcategory: {},
  techparamcategoryParams: {}
};

const slice = createSlice({
  name: 'techparamcategory', 
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setTechparamcategoryEditFormVisibility(state, action){
      console.log('toggle', action.payload);
      state.techparamcategoryEditFormFlag = action.payload;
    },
    
    // RESET CUSTOMER
    resetTechparamcategory(state){
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
    getTechparamcategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.techparamcategories = action.payload;
      state.initial = true;
    },

    // GET Customer
    getTechparamcategorySuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      console.log("IM DONE",action.payload)
      state.techparamcategory = action.payload;
      state.initial = true;
      console.log('techparamcategorySuccessSlice', state.techparamcategory);
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
  setTecparamEditFormVisibility,
  resetTechparamcategory,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;


// ----------------------------------------------------------------------

export function createTechparamcategories (supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    console.log(supplyData)
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}machines/techparamcategories`,supplyData);
      // dispatch(slice.actions)
      console.log(response,"From techparamcategories data");
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e))
    }
  }
}

// ----------------------------------------------------------------------


export function getTechparamcategories (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}machines/techparamcategories`);
      
      dispatch(slice.actions.getTechparamcategoriesSuccess(response.data));
      console.log('data', response.data);
      dispatch(slice.actions.setResponseMessage('techparamcategories loaded successfully'));
      // dispatch(slice.actions)
      console.log(response,"From techparamcategories data");
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error))
    }
  }
}
// ----------------------------------------------------------------------
 
export function getTechparamcategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}machines/techparamcategories/${id}`);
      console.log('slice working',response);
      dispatch(slice.actions.getTechparamcategorySuccess(response.data));
      console.log('requested techparam', response.data);
    } catch (error) {
      console.error(error,"Slice Error");
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteTechparamcategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id[0],'Delete techparam id xyzzzzzzz');
      const response = await axios.delete(`${CONFIG.SERVER_URL}machines/techparamcategories/${id}`);
      // const response = await axios.delete(`${CONFIG.SERVER_URL}machines/suppliers`,ids);
      dispatch(slice.actions.setResponseMessage(response.data));
      // get again suppliers //search
      
      console.log(response);
      
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// --------------------------------------------------------------------------

export function saveTechparamcategory(params) {
    return async (dispatch) => {
      console.log('params', params);
      dispatch(slice.actions.resetTechparam());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          isDisabled: params?.isDisabled,
          // tradingName: params.tradingName,
          // site: {
          //   name: params.name,
          //   address: {},
          // },
          // technicalContact: {},
          // billingContact: {},
        };
        /* eslint-enable */
        if(params.description){
            data.description = params.description;
          }
        
        const response = await axios.post(`${CONFIG.SERVER_URL}machines/techparamcategories`, data);

        console.log('response', response.data.Techparam);
        dispatch(slice.actions.getTechparamcategoriesSuccess(response.data.Techparamcategory));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }
    };

}

// --------------------------------------------------------------------------

export function updateTechparamcategory(params) {
  console.log('update, working', params)
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
      
      
      const response = await axios.patch(`${CONFIG.SERVER_URL}machines/techparamcategories/${params.id}`,
        data
      );
      console.log(response,"From update success")
      dispatch(getTechparamcategory(params.id));
      dispatch(slice.actions.setTechparamcategoriesEditFormVisibility(false));

    } catch (error) {
      console.error(error,"from updateTechparam");
      dispatch(slice.actions.hasError(error));
    }
  };

}