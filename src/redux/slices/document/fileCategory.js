import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  fileCategoryFormVisibility: false,
  fileCategoryEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  fileCategories: [],
  fileCategory: null,
};

const slice = createSlice({
  name: 'fileCategory',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    // SET TOGGLE
    setFileCategoryFormVisibility(state, action){
      state.fileCategoryFormVisibility = action.payload;
    },

    // SET TOGGLE
    setFileCategoryEditFormVisibility(state, action){
      state.fileCategoryEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET File Categorie
    getFileCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.fileCategories = action.payload;
      state.initial = true;
    },

    // GET File Categorie
    getFileCategorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.fileCategory = action.payload;
      state.initial = true;
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
  setFileCategoryFormVisibility,
  setFileCategoryEditFormVisibility,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------Add FileCategory------------------------------------------

export function addFileCategory(params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const data = {
              name: params.name,
              description: params.description,
              isActive: params.isActive
            }
      const response = await axios.post(`${CONFIG.SERVER_URL}filemanager/categories/`, data);
      dispatch(slice.actions.setResponseMessage('Document Name saved successfully'));
      dispatch(getFileCategories());
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update FileCategory-------------------------------------

export function updateFileCategory(machineId,settingId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        techParam: params.techParam,
        techParamValue: params.techParamValue,
        isActive: params.isActive,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`, data, );
      dispatch(slice.actions.setResponseMessage('File Category updated successfully'));
      dispatch(setFileCategoryEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get File Categories-----------------------------------

export function getFileCategories() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}filemanager/categories/` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      console.log("getFileCategories : ",response);
      dispatch(slice.actions.getFileCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('File Categories loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get File Category---------------------------------------

export function getFileCategory(machineId,settingId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`);
      dispatch(slice.actions.getFileCategorySuccess(response.data));
      dispatch(slice.actions.setResponseMessage('File Category Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive File Category-------------------------------------

export function deleteFileCategory(machineId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${id}` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}


