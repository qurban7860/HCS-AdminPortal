import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  categoryGroup: {},
  categoryGroups: [],
  activeCategoryGroups: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'categoryGroup',
  initialState,
  reducers: {
    
    startLoading(state) {
      state.isLoading = true;
    },
  
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    
    getCategoryGroupsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.categoryGroups = action.payload;
      state.initial = true;
    },
    
    getActiveCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeCategoryGroups = action.payload;
      state.initial = true;
    },
    
    getCategorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.categoryGroup = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    resetCategoryGroup(state){
      state.categoryGroup = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    resetCategoryGroups(state){
      state.categoryGroups = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    resetActiveCategoryGroups(state){
      state.activeCategoryGroups = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    
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
  resetCategoryGroup,
  resetCategoryGroups,
  resetActiveCategoryGroups,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCategoryGroups(){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/groups`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getCategoryGroupsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Category Groups loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveCategoryGroups(){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/groups`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      dispatch(slice.actions.getActiveCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Active Category Groups loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getCategoryGroup(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/groups/${id}`);
      dispatch(slice.actions.getCategorySuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//------------------------------------------------------------------------------

export function deleteCategoryGroup(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/groups/${id}`,
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

export function addCategoryGroup(data) {
    return async (dispatch) => {
      dispatch(slice.actions.resetCategoryGroup());
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.post(`${CONFIG.SERVER_URL}products/groups`, data);
        dispatch(slice.actions.setResponseMessage(response.data));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };
}

// --------------------------------------------------------------------------

export function updateCategoryGroup(data,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/groups/${Id}`, data);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}