import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  documentCategoryFormVisibility: false,
  documentCategoryEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  documentCategories: [],
  activeDocumentCategories:[],
  documentCategory: {},
};

const slice = createSlice({
  name: 'documentCategory',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    // SET TOGGLE
    setDocumentCategoryFormVisibility(state, action){
      state.documentCategoryFormVisibility = action.payload;
    },

    // SET TOGGLE
    setDocumentCategoryEditFormVisibility(state, action){
      state.documentCategoryEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET DOCUMENT Categorie
    getDocumentCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentCategories = action.payload;
      state.initial = true;
    },

    getActiveDocumentCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeDocumentCategories = action.payload;
      state.initial = true;
    },

    // GET DOCUMENT Categorie
    getDocumentCategorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentCategory = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET DOCUMENT CATEGORY
    resetDocumentCategory(state){
      state.documentCategory = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET DOCUMENT CATEGORY
    resetFileCategories(state){
      state.documentCategories = [];
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
  setDocumentCategoryFormVisibility,
  setDocumentCategoryEditFormVisibility,
  resetDocumentCategory,
  resetDocumentCategories,
  setResponseMessage,
} = slice.actions;

// ----------------------------Add Document Category------------------------------------------

export function addDocumentCategory(params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const data = {
              name: params.name,
              description: params.description,
              customerAccess:params.customerAccess,
              isActive: params.isActive,
            }
      const response = await axios.post(`${CONFIG.SERVER_URL}documents/categories/`, data);
      dispatch(slice.actions.setResponseMessage('Document Category saved successfully'));
      dispatch(getDocumentCategories());
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Document Category-------------------------------------

export function updateDocumentCategory(Id,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        name: params.name,
        description: params.description,
        customerAccess:params.customerAccess,
        isActive: params.isActive,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/categories/${Id}`, data );
      dispatch(slice.actions.setResponseMessage('Document Category updated successfully'));
      dispatch(setDocumentCategoryEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get File Categories-----------------------------------

export function getDocumentCategories() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/categories/` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getDocumentCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('File Categories loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get document Category---------------------------------------

export function getDocumentCategory(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/categories/${Id}`);
      dispatch(slice.actions.getDocumentCategorySuccess(response.data));
      dispatch(slice.actions.setResponseMessage('File Category Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Active Document Categories-----------------------------------

export function getActiveDocumentCategories() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/categories/` , 
      {
        params: {
          isArchived: false,
          isActive: true,
        }
      }
      );
      dispatch(slice.actions.getActiveDocumentCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('File Categories loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}





// ---------------------------------archive document Category-------------------------------------

export function deleteDocumentCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/categories/${id}` , 
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


