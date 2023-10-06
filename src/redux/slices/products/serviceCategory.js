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
  serviceCategories: [],
  activeServiceCategories: [],
  serviceCategory: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'serviceCategory',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // SET TOGGLE
    setServiceCategoryEditFormVisibility(state, action){
      state.categoryEditFormVisibility = action.payload;
    },
    // SET TOGGLE
    setServiceCategoryFormVisibility(state, action){
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
      state.serviceCategories = action.payload;
      state.initial = true;
    },
    // GET Active Categories
    getActiveCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeServiceCategories = action.payload;
      state.initial = true;
    },
    // GET Category
    getCategorySuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.serviceCategory = action.payload;
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
    resetServiceCategory(state){
      state.serviceCategory = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET CATEGORIES
    resetServiceCategories(state){
      state.serviceCategories = [];
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
  setServiceCategoryFormVisibility,
  setServiceCategoryEditFormVisibility,
  resetServiceCategory,
  resetServiceCategories,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getServiceCategories (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/CheckItemCategories`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Service Categories loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveServiceCategories (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/CheckItemCategories`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      dispatch(slice.actions.getActiveCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Service Categories loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getServiceCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/CheckItemCategories/${id}`);
      dispatch(slice.actions.getCategorySuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//------------------------------------------------------------------------------

export function deleteServiceCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/CheckItemCategories/${id}`,
      {
        isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function addServiceCategory(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetServiceCategory());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          isActive: params.isActive
        };
        /* eslint-enable */
        if(params.description){
            data.description = params.description;
          }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/CheckItemCategories`, data);
        dispatch(slice.actions.setResponseMessage(response.data.Category));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };
}

// --------------------------------------------------------------------------

export function updateServiceCategory(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      const data = {
        name: params.name,
        isActive: params.isActive,
        description: params.description
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}products/CheckItemCategories/${Id}`,
        data
      );
      dispatch(getServiceCategories(params.id));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}