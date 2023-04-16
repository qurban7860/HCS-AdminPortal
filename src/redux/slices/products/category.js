import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  formVisibility: false,
  editFormVisibility: false,
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
    setEditFormVisibility(state, action){
      state.editFormVisibility = action.payload;
    },
    // SET TOGGLE
    setFormVisibility(state, action){
      state.formVisibility = action.payload;
    },
    // RESET Category
    resetCategory(state){
      state.category = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET Categories
    resetCategories(state){
      state.category = {};
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
    // GET Categories
    getCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.categories = action.payload;
      state.initial = true;
    },
    // GET Category
    getCategorySuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.category = action.payload;
      state.initial = true;
    },
    // SET RESPONSE MWSSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const {
  setFormVisibility,
  setEditFormVisibility,
  resetCategory,
  resetCategories,
  setResponseMessage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCategories (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/categories`);
      dispatch(slice.actions.getCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Categories loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message))
    }
  }
}

// ----------------------------------------------------------------------

export function getCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/categories/${id}`);
      dispatch(slice.actions.getCategorySuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

//------------------------------------------------------------------------------

export function deleteCategories(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/categories/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// --------------------------------------------------------------------------

export function addCategory(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetCategory());
      dispatch(slice.actions.startLoading());
      try {
        
        /* eslint-disable */
        let data = {
          name: params.name,
          isActive: params.isActive,
        };
        /* eslint-enable */
        if(params.description){
            data.description = params.description;
          }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/categories`, data);
        dispatch(slice.actions.setResponseMessage(response.data.Category));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
      }
    };
}

// --------------------------------------------------------------------------

export function updateCategory(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      const data = {
        name: params.name,
        isActive: params.isActive,
        description: params.description,
      };
     /* eslint-enable */
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/categories/${Id}`,
        data
      );
      dispatch(getCategories(params.id));
      dispatch(slice.actions.setEditFormVisibility(false));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}