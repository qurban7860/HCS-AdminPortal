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
  isLoadingCheckItems: false,
  error: null,
  serviceRecordConfigs: [],
  activeServiceRecordConfigs: [],
  activeServiceRecordConfigsForRecords: [],
  serviceRecordConfig: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  statusTypes: [
    { _id:1 , name: 'Healthy'},
    { _id:2 , name: 'Service Required'},
    { _id:3 , name: 'Under Service'},
    { _id:4 , name: 'Replacement Required'},
    { _id:5 , name: 'Replaced Recently'},

  ],
  recordTypes: [
    { _id:1 , name: 'SERVICE'},
    { _id:2 , name: 'REPAIR'},
    { _id:3 , name: 'TRAINING'},
    { _id:4 , name: 'PRE-INSTALL'},
    { _id:5 , name: 'INSTALL'},
  ],
  headerFooterTypes: [
    { _id:1 , name: 'Text'},
    { _id:2 , name: 'Image'},
  ],
  status: [
    { _id:1 , name: 'Draft'},
    { _id:2 , name: 'Submitted'},
    { _id:3 , name: 'Approved'},
  ]
};

const slice = createSlice({
  name: 'serviceRecordConfig',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // START LOADING
    startLoadingCheckItems(state) {
      state.isLoadingCheckItems = true;
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
    // GET Active ServiceRecordConfigs for Records
    getActiveServiceRecordConfigsForRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeServiceRecordConfigsForRecords = action.payload;
      state.initial = true;
    },
    // GET ServiceRecordConfig
    getServiceRecordConfigSuccess(state, action) {
      state.isLoading = false;
      state.isLoadingCheckItems = false;
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
          isArchived: false,
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

export function getActiveServiceRecordConfigs (categoryId, machineModelId ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceRecordsConfig`, 
      {
        params: {
          isArchived: false,
          isActive: true,
          machineModel: machineModelId,
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

export function getActiveServiceRecordConfigsForRecords(machineId, type){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());    
    try{

      const query = {
        params: {
          isArchived: false,
          isActive: true,
          recordType: type?.name,
        }
      }

      
      // Object.assign(query.params, type)
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecordsConfig`, query);
      dispatch(slice.actions.getActiveServiceRecordConfigsForRecordsSuccess(response.data));
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
    dispatch(slice.actions.startLoadingCheckItems());
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

export function approveServiceRecordConfig(id, isVerified) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceRecordsConfig/${id}`,
      {
        isApproved: isVerified, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function changeStatusToDraft(id, status) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceRecordsConfig/${id}`,
      {
        status, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
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
          recordType: params.recordType?.name.toUpperCase(),
          status: params.status,
          docVersionNo: params.docVersionNo,
          NoOfApprovalsRequired: params.NoOfApprovalsRequired,
          header: {},
          footer: {},
          checkParams: [],
          isActive: params.isActive,
        };
        /* eslint-enable */
        if(params.machineModel){
          data.machineModel = params.machineModel?._id;
        }

        if(params.category){
          data.machineCategory = params.category?._id;
        }
        if(params.docTitle){
          data.docTitle = params.docTitle;
        }
        if(params.textBeforeCheckItems){
          data.textBeforeCheckItems = params.textBeforeCheckItems;
        }
        if(params.textAfterCheckItems){
          data.textAfterCheckItems = params.textAfterCheckItems;
        }
        if(params.isOperatorSignatureRequired){
          data.isOperatorSignatureRequired = params.isOperatorSignatureRequired;
        }
        if(params.enableNote){
          data.enableNote = params.enableNote;
        }
        if(params.enableMaintenanceRecommendations){
          data.enableMaintenanceRecommendations = params.enableMaintenanceRecommendations;
        }
        if(params.enableSuggestedSpares){
          data.enableSuggestedSpares = params.enableSuggestedSpares;
        }
        // header
        if(params.headerType){
          data.header.type = params.headerType?.name;
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
          data.footer.type = params.footerType?.name;
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
        if(params?.checkParam){
          data.checkParams = (params?.checkParam || [])
          .map((param) => ({
            paramListTitle: param.paramListTitle || '', 
            paramList: (param.paramList || [])
              .map((paramlist) => (paramlist?._id || null))
              .filter((item) => item !== null), 
          }))
          .filter((param) => param.paramList.length > 0);
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
        docTitle: params?.docTitle,
        recordType: params?.recordType?.name,
        status: params.status,
        docVersionNo: params.docVersionNo,
        NoOfApprovalsRequired: params.NoOfApprovalsRequired,
        machineCategory: params?.category?._id || null,
        machineModel: params?.machineModel?._id || null,
        textBeforeCheckItems: params?.textBeforeCheckItems,
        textAfterCheckItems: params?.textAfterCheckItems,
        isOperatorSignatureRequired: params?.isOperatorSignatureRequired,
        enableNote: params?.enableNote,
        enableMaintenanceRecommendations: params?.enableMaintenanceRecommendations,
        enableSuggestedSpares: params?.enableSuggestedSpares,
        header: {},
        footer: {},
        checkParams: [],
        isActive: params.isActive,
      };

      // header
      data.header = {
        type: params?.headerType?.name,
        leftText: params?.headerLeftText,
        centerText: params?.headerCenterText,
        rightText: params?.headerRightText,
      }

      // footer
      data.footer = {
        type: params?.footerType?.name,
        leftText: params?.footerLeftText,
        centerText: params.footerCenterText,
        rightText: params.footerRightText,
      }

      // checkParams
      if(params?.checkParam){
        data.checkParams = (params?.checkParam || [])
        .map((param) => ({
          paramListTitle: param.paramListTitle || '', 
          paramList: (param.paramList || [])
            .map((paramlist) => (paramlist?._id || null))
            .filter((item) => item !== null), 
        }))
        .filter((param) => param.paramList.length > 0);
      }else{
        data.checkParams = [];
      }
      console.log("data : ", data)
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