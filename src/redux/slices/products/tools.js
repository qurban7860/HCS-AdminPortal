import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  toolEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  tools: [],
  tool: {},
  toolParams: {

  }
};

const slice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setToolEditFormVisibility(state, action){
      console.log('toggle', action.payload);
      state.toolEditFormFlag = action.payload;
    },
    
    // RESET CUSTOMER
    resetTool(state){
      state.tool = {};
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
    getToolsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.tools = action.payload;
      state.initial = true;
    },

    // GET Customer
    getToolSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      console.log("IM DONE",action.payload)
      state.tool = action.payload;
      state.initial = true;
      console.log('toolSuccessSlice', state.tool);
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
  setToolEditFormVisibility,
  resetTool,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;


// ----------------------------------------------------------------------

// export function saveTool (supplyData){
//   return async (dispatch) =>{
//     dispatch(slice.actions.startLoading());
//     try{

//       const response = await axios.post(`${CONFIG.SERVER_URL}products/tools`,supplyData);
//       // dispatch(slice.actions)
//     } catch (e) {
//       console.log(e);
//       dispatch(slice.actions.hasError(e.Message))
//     }
//   }
// }

// ----------------------------------------------------------------------


export function getTools (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/tools`);

      dispatch(slice.actions.getToolsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('tools loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message))
    }
  }
}
// ----------------------------------------------------------------------
 
export function getTool(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/tools/${id}`);
      dispatch(slice.actions.getToolSuccess(response.data));
    } catch (error) {
      console.error(error,"Slice Error");
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function deleteTool(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/tools/${id}`);
      // const response = await axios.delete(`${CONFIG.SERVER_URL}machines/suppliers`,ids);
      dispatch(slice.actions.setResponseMessage(response.data));
      // get again suppliers //search
      
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// --------------------------------------------------------------------------

export function saveTool(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetTool());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          isDisabled: params?.isDisabled
        };
        /* eslint-enable */
        if(params.description){
            data.description = params.description;
          }

        
        const response = await axios.post(`${CONFIG.SERVER_URL}products/tools`, data);

        dispatch(slice.actions.getToolsSuccess(response.data.Tool));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
      }
    };

}

// --------------------------------------------------------------------------

export function updateTool(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const formData = new FormData();
      /* eslint-disable */
      let data = {
        id: params.id,
        name: params.name,
        isDisabled: !params.isDisabled,
        
      };
     /* eslint-enable */
     if(params.description){
        data.description = params.description;
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/tools/${params.id}`,
        data
      );
      dispatch(getTool(params.id));
      // dispatch(slice.actions.setToolsEditFormVisibility(false));

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };

}