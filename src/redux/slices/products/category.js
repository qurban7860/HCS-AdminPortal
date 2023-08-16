import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  categoryFormVisibility: false,
  categoryEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  categories: [],
  activeCategories: [],
  category: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
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
      state.categoryEditFormVisibility = action.payload;
    },
    // SET TOGGLE
    setCategoryFormVisibility(state, action){
      state.categoryFormVisibility = action.payload;
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
    // GET Active Categories
    getActiveCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeCategories = action.payload;
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

    // RESET CATEGORIES
    resetCategory(state){
      state.category = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET CATEGORIES
    resetCategories(state){
      state.categories = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
    ChangePage(state, action) {
      state.page = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;
// Actions
export const {
  setCategoryFormVisibility,
  setCategoryEditFormVisibility,
  resetCategory,
  resetCategories,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCategories (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/categories`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Categories loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveCategories (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/categories`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      dispatch(slice.actions.getActiveCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Categories loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
      throw error;
    }
  };
}

//------------------------------------------------------------------------------

export function deleteCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/categories/${id}`,
      {
        isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
          connections: params.connections
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
        throw error;
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
        connections: params.connections
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}products/categories/${Id}`,
        data
      );
      dispatch(getCategories(params.id));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}