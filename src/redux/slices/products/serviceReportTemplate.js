import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
export const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  isLoadingCheckItems: false,
  error: null,
  serviceReportTemplates: [],
  activeServiceReportTemplates: [],
  activeServiceReportTemplatesForRecords: [],
  serviceReportTemplate: {},
  filterBy: '',
  filterList: 'active',
  page: 0,
  rowsPerPage: 100,
  
  statusTypes: [
    { _id:1 , name: 'Healthy'},
    { _id:2 , name: 'Service Required'},
    { _id:3 , name: 'Under Service'},
    { _id:4 , name: 'Replacement Required'},
    { _id:5 , name: 'Replaced Recently'},
    { _id:6 , name: 'Yes'},
    { _id:6 , name: 'No'},
  ],

  reportTypes: [
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
  name: 'serviceReportTemplate',
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
    
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    // GET serviceReportTemplates
    getServiceReportTemplatesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.serviceReportTemplates = action.payload;
      state.initial = true;
    },
    // GET Active serviceReportTemplates
    getActiveServiceReportTemplatesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeServiceReportTemplates = action.payload;
      state.initial = true;
    },
    // GET Active serviceReportTemplates for Records
    getActiveServiceReportTemplatesForRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeServiceReportTemplatesForRecords = action.payload;
      state.initial = true;
    },
    // GET serviceReportTemplate
    getServiceReportTemplateSuccess(state, action) {
      state.isLoading = false;
      state.isLoadingCheckItems = false;
      state.success = true;
      state.serviceReportTemplate = action.payload;
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
    resetServiceReportTemplate(state){
      state.serviceReportTemplate = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET CATEGORIES
    resetServiceReportTemplates(state){
      state.serviceReportTemplates = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    // Set FilterListBy
    setFilterList(state, action) {
      state.filterList = action.payload;
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
  resetServiceReportTemplate,
  resetServiceReportTemplates,
  setResponseMessage,
  setFilterBy,
  setFilterList,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getServiceReportTemplates (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceReportTemplates`, 
      {
        params: {
          isArchived: false,
        }
      });
      dispatch(slice.actions.getServiceReportTemplatesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('ServiceReportTemplates loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveServiceReportTemplates (categoryId, machineModelId ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceReportTemplates`, 
      {
        params: {
          isArchived: false,
          isActive: true,
          machineModel: machineModelId,
        }
      });
      dispatch(slice.actions.getActiveServiceReportTemplatesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('ServiceReportTemplates loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}


// ----------------------------------------------------------------------

export function getActiveServiceReportTemplatesForRecords(machineId, type){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());    
    try{

      const query = {
        params: {
          isArchived: false,
          isActive: true,
          status: 'APPROVED',
          reportType: type?.name,
        }
      }

      
      // Object.assign(query.params, type)
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportTemplates`, query);
      dispatch(slice.actions.getActiveServiceReportTemplatesForRecordsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('ServiceReportTemplates loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getServiceReportTemplate(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.startLoadingCheckItems());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceReportTemplates/${id}`);
      dispatch(slice.actions.getServiceReportTemplateSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//------------------------------------------------------------------------------

export function approveServiceReportTemplate(id, isVerified) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceReportTemplates/${id}`,
      {
        isVerified: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function changeServiceReportStatus(id, status) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceReportTemplates/${id}`,
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

export function deleteServiceReportTemplate(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceReportTemplates/${id}`,
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

export function addServiceReportTemplate(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetServiceReportTemplate());
      dispatch(slice.actions.startLoading());
      try {

        /* eslint-disable */
        let data = {
          reportType: params.reportType?.name.toUpperCase(),
          status: params.status,
          docVersionNo: params.docVersionNo,
          noOfApprovalsRequired: params.noOfApprovalsRequired,
          header: {},
          footer: {},
          originalTemplate: params.originalTemplate || null,
          isActive: params.isActive,
        };
        /* eslint-enable */
        if(params.parentConfig){
          data.parentTemplate = params.parentTemplate;
        }
        if(params.machineModel){
          data.machineModel = params.machineModel?._id;
        }

        if(params.machineCategory){
          data.machineCategory = params.machineCategory?._id;
        }
        if(params.reportTitle){
          data.reportTitle = params.reportTitle;
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
        if(params?.checkItemLists){
          data.checkItemLists = (params?.checkItemLists || [])
          .map((param) => ({
            ListTitle: param.ListTitle || '', 
            checkItems: (param.checkItems || [])
              .map((paramlist) => (paramlist?._id || null))
              .filter((item) => item !== null), 
          }))
          .filter((param) => param.checkItems.length > 0);
        }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/serviceReportTemplates`, data);
        dispatch(slice.actions.setResponseMessage(response.data.ServiceReportTemplate));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };
}

// --------------------------------------------------------------------------

export function updateServiceReportTemplate(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        reportTitle: params?.reportTitle,
        reportType: params?.reportType?.name,
        status: params.status,
        docVersionNo: params.docVersionNo,
        noOfApprovalsRequired: params.noOfApprovalsRequired,
        machineCategory: params?.machineCategory?._id || null,
        machineModel: params?.machineModel?._id || null,
        textBeforeCheckItems: params?.textBeforeCheckItems,
        textAfterCheckItems: params?.textAfterCheckItems,
        isOperatorSignatureRequired: params?.isOperatorSignatureRequired,
        enableNote: params?.enableNote,
        enableMaintenanceRecommendations: params?.enableMaintenanceRecommendations,
        enableSuggestedSpares: params?.enableSuggestedSpares,
        header: {},
        footer: {},
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
      if(params?.checkItemLists){
        data.checkItemLists = (params?.checkItemLists || [])
        .map((param) => ({
          ListTitle: param.ListTitle || '', 
          checkItems: (param.checkItems || [])
            .map((paramlist) => (paramlist?._id || null))
            .filter((item) => item !== null), 
        }))
        .filter((param) => param.checkItems.length > 0);
      }else{
        data.checkItemLists = [];
      }
      await axios.patch(`${CONFIG.SERVER_URL}products/serviceReportTemplates/${Id}`,
        data
      );
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}