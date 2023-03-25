import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  categoryEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  categories: [],
  category: {},
  categoryParams: {

  }
};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setCategoryEditFormVisibility(state, action){
      console.log('toggle', action.payload);
      state.categoryEditFormFlag = action.payload;
    },
  
    // RESET CUSTOMER
    resetCategory(state){
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
    getCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.categories = action.payload;
      state.initial = true;
    },

    // GET Customer
    getCategorySuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.category = action.payload;
      state.initial = true;
      console.log('categorySuccessSlice', state.category);
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
  setCategoryEditFormVisibility,
  resetCategory,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;


// ----------------------------------------------------------------------

export function createCategorys (supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    console.log(" Category",supplyData)
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}products/categories`,supplyData);
      // dispatch(slice.actions)
      console.log(response,"From category data");
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e))
    }
  }
}

// ----------------------------------------------------------------------


export function getCategories (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/categories`);
      console.log(" Category",response)
      dispatch(slice.actions.getCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Categories loaded successfully'));
      // dispatch(slice.actions)
      console.log(response,"From category data");
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error))
    }
  }
}
// ----------------------------------------------------------------------

export function getCategory(id) {
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/categories/${id}`);
      console.log('Response',response.data)
      dispatch(slice.actions.getCategorySuccess(response.data));
      console.log('requested categories', response.data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteCategories(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id[0],'Delete categories id xyzzzzzzz');
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/categories/${id}`);
     
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

export function saveCategory(params) {
    return async (dispatch) => {
      console.log('params', params);
      dispatch(slice.actions.resetCategory());
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
        
        const response = await axios.post(`${CONFIG.SERVER_URL}products/categories`, data);

        console.log('response', response.data.Category);
        dispatch(slice.actions.getCategoriesSuccess(response.data.Category));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }
    };

}

// --------------------------------------------------------------------------

export function updateCategory(params) {
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
      
      
      
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/categories/${params.id}`,
        data
      );

      dispatch(getCategories(params.id));
      dispatch(slice.actions.setCategoryEditFormVisibility(false));

      // this.updateCustomerSuccess(response);

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };

}