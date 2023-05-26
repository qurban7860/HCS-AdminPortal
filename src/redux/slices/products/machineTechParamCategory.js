import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  intial: false,
  techparamEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  techparamcategory: {},
  techparamcategories: [],
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
      state.techparamEditFormFlag = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  TECH PARAM CATEGORY
    getTechparamcategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.techparamcategories = action.payload;
      state.initial = true;
    },

    // GET  TECH PARAM CATEGORY
    getTechparamcategorySuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.techparamcategory = action.payload;
      state.initial = true;
    },


    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET TECH PARAM CATEGORY
    resetTechParamCategory(state){
      state.techparamcategory = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET TECH PARAM CATEGORIES
    resetTechParamCategories(state){
      state.techparamcategories = [];
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
  setTecparamEditFormVisibility,
  resetTechParamCategory,
  resetTechParamCategories,
  setResponseMessage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getTechparamcategories (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/techparamcategories`, 
      {
        params: {
          isArchived: false
        }
      }
      );
      
      dispatch(slice.actions.getTechparamcategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('techparamcategories loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message))
    }
  }
}
// ----------------------------------------------------------------------
 
export function getTechparamcategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/techparamcategories/${id}`);
      dispatch(slice.actions.getTechparamcategorySuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

export function deleteTechparamcategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/techparamcategories/${id}`);
      // const response = await axios.delete(`${CONFIG.SERVER_URL}machines/suppliers`,ids);
      dispatch(slice.actions.setResponseMessage(response.data));
      // get again suppliers //search
      
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// --------------------------------------------------------------------------

export function addTechparamcategory(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetTechparamcategory());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          tradingName: params.tradingName,
          description: params.description,
          site: {
            name: params.name,
            address: {},
          },
          technicalContact: {},
          billingContact: {},
          isActive: params.isActive,
        };
        /* eslint-enable */
        const response = await axios.post(`${CONFIG.SERVER_URL}products/techparamcategories`, data);

        dispatch(slice.actions.getTechparamcategoriesSuccess(response.data.Techparamcategory));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
      }
    };

}

// --------------------------------------------------------------------------

export function updateTechparamcategory(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        name: params.name,
        isActive: params.isActive,
        description: params.description,
        // tradingName: params.tradingName
      };
     /* eslint-enable */
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/techparamcategories/${Id}`,
        data
      );
      dispatch(getTechparamcategory(Id));
      // dispatch(slice.actions.setTechparamcategoriesEditFormVisibility(false));

    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
    }
  };

}