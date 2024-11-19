import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  isLoading: false,
  isLoadingReportNote: false,
  error: null,
  serviceReportNote: {},
  serviceReportNotes: [],
  activeServiceReportNotes:[],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'serviceReportNotes',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    
    startLoadingReportNote(state) {
      state.isLoadingReportNote = true;
    },

    // GET  Notes
    getServiceReportNotesSuccess(state, action) {
      state.isLoadingReportStatus = false;
      state.isLoading = false;
      state.serviceReportNotes = action.payload;
    },

    // GET Active Notes
    getActiveServiceReportNotesSuccess(state, action) {
      state.isLoading = false;
      state.activeServiceReportNotes = action.payload;
    },

    // GET Note
    getServiceReportNoteSuccess(state, action) {
      state.isLoading = false;
      state.serviceReportNotes = action.payload;
    },
    // RESET 
    resetServiceReportNote(state){
      state.serviceReportNote = {};
      state.isLoading = false;
    },

    // RESET 
    resetServiceReportNotes(state){
      state.serviceReportNotes = [];
      state.isLoading = false;
    },
    // RESET 
    resetActiveServiceReportNotes(state){
      state.activeServiceReportNotes = [];
      state.isLoading = false;
    },

    hasError(state, action) {
      state.isLoadingReportNote = false;
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
  resetServiceReportNote,
  resetServiceReportNotes,
  resetActiveServiceReportNotes,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getServiceReportNotes( serviceReportId ){
  return async (dispatch) =>{
    try{
      dispatch(slice.actions.startLoadingReportNote());
      dispatch(slice.actions.startLoading());
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getServiceReportNotesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveServiceReportNotes( serviceReportId, cancelToken ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes`, 
      {
        params: {
          isArchived: false,
          isActive: true,
        },
        cancelToken: cancelToken?.token,
      });
      dispatch(slice.actions.getActiveServiceReportNotesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getServiceReportNote( serviceReportId, id ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes/${id}`);
      dispatch(slice.actions.getServiceReportNoteSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//----------------------------------------------------------------

export function deleteServiceReportNote( serviceReportId, id ) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      await axios.patch(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes/${id}` , 
      {
          isArchived: true, 
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function addServiceReportNote( serviceReportId, params ) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const data = {
          name: params?.name || "",
          type: params?.type || "",
          displayOrderNo: params?.displayOrderNo || "",
          description: params?.description || "",
          isActive: params?.isActive,
        };
        const response = await axios.post(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes`, data);
        dispatch(slice.actions.getServiceReportNoteSuccess(response.data));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };
}

// --------------------------------------------------------------------------

export function updateServiceReportNote( serviceReportId, Id, params ) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      const data = {
        name: params?.name || "",
        type: params?.type || "",
        displayOrderNo: params?.displayOrderNo || "",
        description: params?.description || "",
        isActive: params?.isActive,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes/${Id}`, data );
      dispatch(slice.actions.getServiceReportNoteSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}