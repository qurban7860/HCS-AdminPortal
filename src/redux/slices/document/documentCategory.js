import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
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
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  reportHiddenColumns: {
    name: false,
    customer: false,
    customerAccess: false,
    isActive: false,
    createdAt: false,
  },
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

    // RESET DOCUMENT ACTIVE CATEGORIES
    resetActiveDocumentCategories(state){
      state.activeDocumentCategories = [];
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
    // Add new reducer for hidden columns
    setReportHiddenColumns(state, action) {
      state.reportHiddenColumns = action.payload;
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
  resetActiveDocumentCategories,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns,
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
              isDefault: params.isDefault,
            }
            if(params.type) {
              data.customer = params.type.customer
              data.machine = params.type.machine
              data.drawing = params.type.drawing
            }
      await axios.post(`${CONFIG.SERVER_URL}documents/categories/`, data);
      dispatch(slice.actions.setResponseMessage('Document Category saved successfully'));
      dispatch(getDocumentCategories());
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
        isDefault: params.isDefault,
      }
      if(params.type) {
        data.customer = params.type.customer
        data.machine = params.type.machine
        data.drawing = params.type.drawing
      }
      await axios.patch(`${CONFIG.SERVER_URL}documents/categories/${Id}`, data );
      dispatch(slice.actions.setResponseMessage('Document Category updated successfully'));
      dispatch(setDocumentCategoryEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get File Categories-----------------------------------

export function getDocumentCategories(isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/categories/` , 
      {
        params: {
          isArchived: isArchived || false
        }
      }
      );
      dispatch(slice.actions.getDocumentCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('File Categories loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
      throw error;
    }
  };
}

// -----------------------------------Get Active Document Categories-----------------------------------

export function getActiveDocumentCategories( categoryBy, cancelToken, drawing ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const query = {
        params: {
          isArchived: false,
          isActive: true,
          drawing
        },
        cancelToken: cancelToken?.token,
      }
      
      Object.assign(query.params, categoryBy)
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/categories/` , query );
      dispatch(slice.actions.getActiveDocumentCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('File Categories loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      // throw error;
    }
  };
}

// ---------------------------------archive document Category-------------------------------------

export function archiveDocumentCategory(id) {
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

// ---------------------------------restore document Category-------------------------------------

export function restoreDocumentCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/categories/${id}` , 
      {
          isArchived: false, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------delete document Category-------------------------------------

export function deleteDocumentCategory(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}documents/categories/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}




