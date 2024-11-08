import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  isLoading: false,
  error: null,
  serviceReportStatus: {},
  serviceReportStatuses: [],
  activeServiceReportStatuses:[],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'serviceReportStatuses',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // GET  STATUSES
    getServiceReportStatusesSuccess(state, action) {
      state.isLoading = false;
      state.serviceReportStatuses = action.payload;
      state.initial = true;
    },

    // GET Active STATUSES
    getActiveServiceReportStatusesSuccess(state, action) {
      state.isLoading = false;
      state.activeServiceReportStatuses = action.payload;
      state.initial = true;
    },

    // GET STATUS
    getServiceReportStatusSuccess(state, action) {
      state.isLoading = false;
      state.serviceReportStatus = action.payload;
      state.initial = true;
    },
    // RESET 
    resetServiceReportStatus(state){
      state.serviceReportStatus = {};
      state.isLoading = false;
    },

    // RESET 
    resetServiceReportStatuses(state){
      state.serviceReportStatuses = [];
      state.isLoading = false;
    },
    // RESET 
    resetActiveServiceReportStatuses(state){
      state.activeServiceReportStatuses = [];
      state.isLoading = false;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.initial = true;
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
  resetServiceReportStatus,
  resetServiceReportStatuses,
  resetActiveServiceReportStatuses,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getServiceReportStatuses(){
  return async (dispatch) =>{
    try{
      dispatch(slice.actions.startLoading());
      const response = await axios.get(`${CONFIG.SERVER_URL}products/productServiceReportStatus`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getServiceReportStatusesSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveServiceReportStatuses ( cancelToken ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/productServiceReportStatus`, 
      {
        params: {
          isArchived: false,
          isActive: true,
        },
        cancelToken: cancelToken?.token,
      });
      dispatch(slice.actions.getActiveServiceReportStatusesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getServiceReportStatus(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/productServiceReportStatus/${id}`);
      dispatch(slice.actions.getServiceReportStatusSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//----------------------------------------------------------------

export function deleteServiceReportStatus(id) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      await axios.patch(`${CONFIG.SERVER_URL}products/productServiceReportStatus/${id}` , 
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

export function addServiceReportStatus(params) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const data = {
          name: params.name,
          type: params.type,
          displayOrderNo: params.displayOrderNo,
          description: params.description,
          isActive: params.isActive,
          isDefault: params.isDefault,
        };
        const response = await axios.post(`${CONFIG.SERVER_URL}products/productServiceReportStatus`, data);
        dispatch(slice.actions.getServiceReportStatusSuccess(response.data));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateServiceReportStatus(params,Id) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      const data = {
        name: params.name,
        type: params.type,
        displayOrderNo: params.displayOrderNo,
        description: params.description,
        isActive: params.isActive,
        isDefault: params.isDefault,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/productServiceReportStatus/${Id}`, data );
      dispatch(slice.actions.getServiceReportStatusSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}