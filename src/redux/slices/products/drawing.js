import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  drawingFormVisibility: false,
  drawingViewFormVisibility: false,
  drawingEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  drawings: [],
  activeDrawings: [],
  drawing: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'drawing',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // SET ADD FORM TOGGLE
    setDrawingFormVisibility(state, action){
      state.drawingFormVisibility = action.payload;
    },
    // SET EDIT TOGGLE
    setDrawingEditFormVisibility(state, action){
      state.drawingsEditFormVisibility = action.payload;
    },
    // SET VIEW TOGGLE
    setDrawingViewFormVisibility(state, action){
      state.drawingViewFormVisibility = action.payload;
    },
  
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    // GET DRAWINGS
    getDrawingsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.drawings = action.payload;
      state.initial = true;
    },
    // GET Active DRAWINGS
    getActiveDrawingsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeDrawings = action.payload;
      state.initial = true;
    },
    // GET DRAWINGS
    getDrawingSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.drawing = action.payload;
      state.initial = true;
    },
    // SET RESPONSE MWSSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET DRAWINGS
    resetDrawing(state){
      state.drawing = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET DRAWINGS
    resetDrawings(state){
      state.drawings = [];
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
  setDrawingFormVisibility,
  setDrawingEditFormVisibility,
  setDrawingViewFormVisibility,
  resetDrawing,
  resetDrawings,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getDrawings(machineId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/drawings`, 
      {
        params: {
          isArchived: false,
          machine: machineId
        }
      });
      dispatch(slice.actions.getDrawingsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Drawings loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveDrawings (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/drawings`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      dispatch(slice.actions.getActiveDrawingsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Drawings loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getDrawing(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/drawings/${id}`);
      dispatch(slice.actions.getDrawingSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//------------------------------------------------------------------------------

export function deleteDrawing(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/drawings/${id}`,
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

export function addDrawing(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetDrawing());
      dispatch(slice.actions.startLoading());
      try {

        /* eslint-disable */
        let data = {
            machine: params.machine,
            documentCategory: params.documentCategory?._id,
            documentType: params.documentType?._id,
            documentId: params.document?._id,
            isActive: params.isActive
        };
        /* eslint-enable */
        if(params.description){
            data.description = params.description;
          }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/drawings`, data);
        dispatch(slice.actions.setResponseMessage(response.data.drawing));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };
}

// --------------------------------------------------------------------------

export function updateDrawing(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      const data = {
        machine: params.machine,
        documentCategory: params.documentCategory,
        documentType: params.type,
        document: params.document,
        isActive: params.isActive
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}products/drawings/${Id}`,
        data
      );
      dispatch(getDrawing(params.id));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}