import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  serviceRecordConfigFormVisibility: false,
  serviceRecordConfigEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  serviceRecordConfigs: [],
  activeServiceRecordConfigs: [],
  serviceRecordConfig: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  recordTypes: [
    { _id:1 , name: 'Service'},
    { _id:2 , name: 'Repair'},
    { _id:3 , name: 'Training'},
    { _id:4 , name: 'Install'},
  ]
};

export const recordType = [ 'Service','Repair','Training','Install']

const slice = createSlice({
  name: 'serviceRecordConfig',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // SET TOGGLE
    setServiceRecordConfigEditFormVisibility(state, action){
      state.serviceRecordConfigEditFormVisibility = action.payload;
    },
    // SET TOGGLE
    setServiceRecordConfigFormVisibility(state, action){
      state.serviceRecordConfigFormVisibility = action.payload;
    },
  
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    // GET ServiceRecordConfigs
    getServiceRecordConfigsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.serviceRecordConfigs = action.payload;
      state.initial = true;
    },
    // GET Active ServiceRecordConfigs
    getActiveServiceRecordConfigsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeServiceRecordConfigs = action.payload;
      state.initial = true;
    },
    // GET ServiceRecordConfig
    getServiceRecordConfigSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.serviceRecordConfig = action.payload;
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
    resetServiceRecordConfig(state){
      state.serviceRecordConfig = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET CATEGORIES
    resetServiceRecordConfigs(state){
      state.serviceRecordConfigs = [];
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
  setServiceRecordConfigFormVisibility,
  setServiceRecordConfigEditFormVisibility,
  resetServiceRecordConfig,
  resetServiceRecordConfigs,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getServiceRecordConfigs (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceRecordsConfig`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getServiceRecordConfigsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('ServiceRecordConfigs loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveServiceRecordConfigs (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceRecordsConfigs`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      dispatch(slice.actions.getActiveServiceRecordConfigsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('ServiceRecordConfigs loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getServiceRecordConfig(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceRecordsConfig/${id}`);
      dispatch(slice.actions.getServiceRecordConfigSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//------------------------------------------------------------------------------

export function deleteServiceRecordConfig(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceRecordsConfig/${id}`,
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

export function addServiceRecordConfig(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetServiceRecordConfig());
      dispatch(slice.actions.startLoading());
      try {

        /* eslint-disable */
        let data = {
          recordType: params.recordType,
          header: {},
          footer: {},
          checkParams: [],
          isActive: params.isActive,
        };
        /* eslint-enable */
        if(params.machineModel){
          data.machineModel = params.machineModel;
        }
        if(params.docTitle){
          data.docTitle = params.docTitle;
        }
        if(params.textBeforeParams){
          data.textBeforeParams = params.textBeforeParams;
        }
        if(params.textAfterFields){
          data.textAfterFields = params.textAfterFields;
        }
        if(params.machineModel){
          data.machineModel = params.machineModel;
        }
        if(params.isOperatorSignatureRequired){
          data.isOperatorSignatureRequired = params.isOperatorSignatureRequired;
        }
        if(params.enableServiceNote){
          data.enableServiceNote = params.enableServiceNote;
        }
        if(params.enableMaintenanceRecommendations){
          data.enableMaintenanceRecommendations = params.enableMaintenanceRecommendations;
        }
        if(params.enableSuggestedSpares){
          data.enableSuggestedSpares = params.enableSuggestedSpares;
        }
        // header
        if(params.headerType){
          data.header.type = params.headerType;
        }
        if(params.headerLeftText){
          data.header.leftText = params.headerLeftText;
        }
        if(params.headerCenterText){
          data.header.centerText = params.headerCenterText;
        }
        if(params.headerRightText){
          data.header.rightText = params.headerRightText;
        }
        // footer
        if(params.footerType){
          data.footer.type = params.footerType;
        }
        if(params.footerLeftText){
          data.footer.leftText = params.footerLeftText;
        }
        if(params.footerCenterText){
          data.footer.centerText = params.footerCenterText;
        }
        if(params.footerRightText){
          data.footer.rightText = params.footerRightText;
        }
        // checkParams
        if(params.paramListTitle){
          data.checkParams.push({paramListTitle: params.paramListTitle});
        }
        if(params.paramList){
          data.checkParams.push({paramList: params.paramList});
        }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/serviceRecordsConfig`, data);
        dispatch(slice.actions.setResponseMessage(response.data.ServiceRecordConfig));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };
}

// --------------------------------------------------------------------------

export function updateServiceRecordConfig(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        recordType: params.recordType,
        header: {},
        footer: {},
        checkParams: [],
        isActive: params.isActive,
      };
      /* eslint-enable */
      if(params.machineModel){
        data.machineModel = params.machineModel;
      }
      if(params.docTitle){
        data.docTitle = params.docTitle;
      }
      if(params.textBeforeParams){
        data.textBeforeParams = params.textBeforeParams;
      }
      if(params.textAfterFields){
        data.textAfterFields = params.textAfterFields;
      }
      if(params.machineModel){
        data.machineModel = params.machineModel;
      }
      if(params.isOperatorSignatureRequired){
        data.isOperatorSignatureRequired = params.isOperatorSignatureRequired;
      }
      if(params.enableServiceNote){
        data.enableServiceNote = params.enableServiceNote;
      }
      if(params.enableMaintenanceRecommendations){
        data.enableMaintenanceRecommendations = params.enableMaintenanceRecommendations;
      }
      if(params.enableSuggestedSpares){
        data.enableSuggestedSpares = params.enableSuggestedSpares;
      }
      // header
      if(params.headerType){
        data.header.type = params.headerType;
      }
      if(params.headerLeftText){
        data.header.leftText = params.headerLeftText;
      }
      if(params.headerCenterText){
        data.header.centerText = params.headerCenterText;
      }
      if(params.headerRightText){
        data.header.rightText = params.headerRightText;
      }
      // footer
      if(params.footerType){
        data.footer.type = params.footerType;
      }
      if(params.footerLeftText){
        data.footer.leftText = params.footerLeftText;
      }
      if(params.footerCenterText){
        data.footer.centerText = params.footerCenterText;
      }
      if(params.footerRightText){
        data.footer.rightText = params.footerRightText;
      }
      // checkParams
      if(params.paramListTitle){
        data.checkParams.push({paramListTitle: params.paramListTitle});
      }
      if(params.paramList){
        data.checkParams.push({paramList: params.paramList});
      }
      await axios.patch(`${CONFIG.SERVER_URL}products/serviceRecordsConfig/${Id}`,
        data
      );
      dispatch(getServiceRecordConfigs(params.id));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}