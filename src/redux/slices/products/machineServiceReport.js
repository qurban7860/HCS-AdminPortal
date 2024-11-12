import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  resetFlags: true,
  responseMessage: null,
  success: false,
  isLoading: false,
  isLoadingCheckItems: false,
  submittingCheckItemIndex: -1,
  error: null,
  machineServiceReport: {},
  machineServiceReports: [],
  machineServiceReportHistory: [],
  activeMachineServiceReports: [],
  machineServiceReportCheckItems: [],
  sendEmailDialog:false,
  pdfViewerDialog:false,
  addFileDialog:false,
  addReportDocsDialog: false,
  completeDialog:false,
  formActiveStep:0,
  isHistorical: false,
  isDetailPage: false,
  filterBy: '',
  filterDraft:false,
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machineServiceReport',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // START LOADING CHECK ITEMS
    startLoadingCheckItems(state) {
      state.isLoadingCheckItems = true;
    },

    setSubmittingCheckItemIndex(state, action) {
      state.submittingCheckItemIndex = action.payload;
    },

    // SET HISTORICAL FLAG
    resetSubmittingCheckItemIndex(state){
      state.submittingCheckItemIndex = -1;
    },

    setResetFlags (state, action){
      state.resetFlags = action.payload;
    },

    // SET ALL TOGGLEs
    setAllFlagsFalse(state, action){
      state.sendEmailDialog = false;
      state.pdfViewerDialog = false;
      state.isHistorical = false;
    },
    // SET HISTORICAL FLAG
    setHistoricalFlag(state, action){
      state.isHistorical = action.payload;;
    },
    // SET DETAIL PAGE FLAG
    setDetailPageFlag(state, action){
      state.isDetailPage = action.payload;;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.isLoadingCheckItems = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET MACHINE SERVICE PARAM
    getMachineServiceReportsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceReports = action.payload;
      state.initial = true;
    },
    // GET MACHINE SERVICE PARAM
    getMachineServiceReportHistorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceReportHistory = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getActiveMachineServiceReportsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeMachineServiceReports = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getMachineServiceReportSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceReport = action.payload;
      state.initial = true;
    },


    getMachineServiceReportCheckItemsSuccess(state, action) {
      state.isLoadingCheckItems = false;
      state.isLoading = false;
      state.success = true;
      state.machineServiceReportCheckItems = action.payload;
      state.initial = true;
    },

    UpdateMachineServiceReportCheckItems(state, action) {
      const { Index, childIndex, checkItem } = action.payload;
      state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue = {
        ...state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue,
        comments: checkItem.comments	,
        checkItemValue: checkItem.checkItemValue,
        files: [ ...state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue.files,
        ...checkItem.files
        ]
      };
    },

    deleteMachineServiceReportCheckItemSuccess(state, action) {
      const { Index, childIndex, checkItem } = action.payload;
      const checkItemFiles = [ ...state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue.files ] 
      state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue = {
        ...state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue,
        files: checkItemFiles?.filter(file => file._id !== checkItem )
      };
    },

    
    // GET MACHINE Active SERVICE PARAM
    updateMachineServiceReportSuccess( state, action ) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceReport = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    addMachineServiceReportFilesSuccess(state) {
      state.isLoading = false;
      state.success = true;
      
      state.initial = true;
    },

    // SET SEND EMAIL DIALOG
    setSendEmailDialog(state, action) {
      state.sendEmailDialog = action.payload;
    },
    
    // SET PDF DIALOG
    setPDFViewerDialog(state, action) {
      state.pdfViewerDialog = action.payload;
    },

    
    // SET ADD FILE DIALOG
    setAddFileDialog(state, action) {
      state.addFileDialog = action.payload;
    },

    // SET ADD FILE DIALOG
    setAddReportDocsDialog(state, action) {
      state.addReportDocsDialog = action.payload;
    },
    
    // SET COMLETE DIALOG
    setCompleteDialog(state, action) {
      state.completeDialog = action.payload;
    },

    // SET COMLETE DIALOG
    setFormActiveStep(state, action) {
      state.formActiveStep = action.payload;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET MACHINE TECH PARAM
    resetMachineServiceReport(state){
      state.machineServiceReport = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM
    resetCheckItemValues(state){
      state.checkItemReportValues = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoadingCheckItems = false;
    },

    // RESET MACHINE TECH PARAM
    resetMachineServiceReports(state){
      state.machineServiceReports = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },

    // Set FilterDraft
    setFilterDraft(state, action) {
      state.filterDraft  = action.payload;
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
  setResetFlags,
  setHistoricalFlag,
  setDetailPageFlag,
  setAllFlagsFalse,
  setSendEmailDialog,
  setPDFViewerDialog,
  setAddFileDialog,
  setAddReportDocsDialog,
  setCompleteDialog,
  setFormActiveStep,
  resetMachineServiceReports,
  resetMachineServiceReport,
  resetCheckItemValues,
  resetSubmittingCheckItemIndex,
  setResponseMessage,
  setFilterBy,
  setFilterDraft,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function sendEmail(machineId,data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      formData.append('email', data.email)
      formData.append('pdf', data.pdf)
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${data.id}/sendEmail`, formData );
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getActiveMachineServiceReports (machineId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      }
      );
      await dispatch(slice.actions.getActiveMachineServiceReportsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

export function getMachineServiceHistoryReports(machineId, primaryServiceReportId ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports`, 
      {
        params: {
          isArchived: false,
          // isHistory: true,
          primaryServiceReportId,
        }
      }
      );
      dispatch(slice.actions.getMachineServiceReportHistorySuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------

export function getMachineServiceReportVersion(machineId, id ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      await dispatch(resetMachineServiceReport());
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/values`);
      dispatch(slice.actions.getMachineServiceReportSuccess(response.data));
      dispatch(setHistoricalFlag(true));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------


export function getMachineServiceReports (machineId, isMachineArchived){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const params = {
        isArchived: false,
        $or: [
            { isHistory: false },
            // { status: { type: { $regex: '^DRAFT$', $options: 'i' } }}
          ],
        orderBy : {
          createdAt: -1
        }
      }
    if(isMachineArchived){
      params.archivedByMachine = true;
      params.isArchived = true;
    }
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports`, { params } );
      dispatch(slice.actions.getMachineServiceReportsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}


// ----------------------------------------------------------------------
export function getMachineServiceReport(machineId, id, isHighQuality ) {
  return async (dispatch) => {
    if(!isHighQuality){
      dispatch(slice.actions.startLoading());
    }
    try {
      const params = {};
      if(isHighQuality){
        params.isHighQuality = true;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}`,{ params });
      await dispatch(slice.actions.getMachineServiceReportSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteMachineServiceReport(machineId, id, status ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}` , 
      {
          isArchived: true, 
          isActive: false,
          status 
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

export function addMachineServiceReport(machineId, params) {
    return async (dispatch) => {
      // dispatch(slice.actions.startLoading());
      try {
        const data = {
          serviceReportTemplate:      params?.serviceReportTemplate?._id,
          serviceDate:                params?.serviceDate,
          versionNo:                  params?.versionNo,
          customer:                   params?.customer,
          site:                       params?.site,
          status:                     params?.status || 'DRAFT',
          machine:                    machineId,
          decoilers:                  params?.decoilers?.map((dec)=> dec?._id),
          technician:                 params?.technician?._id,
          technicianNotes:            params?.technicianNotes,
          textBeforeCheckItems:       params?.textBeforeCheckItems,
          textAfterCheckItems:        params?.textAfterCheckItems,
          serviceNote:                params?.serviceNote,
          recommendationNote:         params?.recommendationNote,
          internalComments:           params?.internalComments,
          suggestedSpares:            params?.suggestedSpares,
          internalNote:               params.internalNote,
          operators:                  params?.operators?.map((ope)=> ope?._id) || [],
          operatorNotes:              params?.operatorNotes || '',
          checkItemReportValues:      params?.checkItemReportValues || [],
          isReportDocsOnly:           params?.isReportDocsOnly,
          isActive:                   params?.isActive
        }
        // const formData = new FormData();
        // formData.append('serviceReportTemplate', params?.serviceReportTemplate?._id || null);
        // formData.append('serviceDate', params?.serviceDate);
        // formData.append('versionNo', params?.versionNo);
        // formData.append('customer', params?.customer || null);
        // formData.append('site', params?.site || null);
        // formData.append('machine', machineId);
        // formData.append(`decoilers`, params?.decoilers?.map((dec) => dec?._id) || []);
        // formData.append('technician', params?.technician?._id || null);
        // formData.append('technicianNotes', params?.technicianNotes);
        // formData.append('textBeforeCheckItems', params?.textBeforeCheckItems);
        // formData.append('textAfterCheckItems', params?.textAfterCheckItems);
        // formData.append('serviceNote', params?.serviceNote);
        // formData.append('recommendationNote', params?.recommendationNote);
        // formData.append('internalComments', params?.internalComments);
        // formData.append('suggestedSpares', params?.suggestedSpares);
        // formData.append('internalNote', params.internalNote);
        // formData.append('operators', params?.operators?.map((ope)=> ope?._id) || []);
        // formData.append('operatorNotes', params.operatorNotes);
        // formData.append('checkItemReportValues', JSON.stringify(params?.checkItemReportValues || []));
        // formData.append('isActive', params?.isActive);

        // if (Array.isArray(params?.files) &&  params?.files?.length > 0) {
        //   params?.files?.forEach((file, index) => {
        //     if (file) {
        //       formData.append('images', file );
        //     }
        //   });
        // }
        
        const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports`, data );
        dispatch(slice.actions.getMachineServiceReportSuccess(response.data));

        return response?.data;

      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachineServiceReport(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        // serviceReportTemplate:        params?.serviceReportTemplate,
        serviceDate:                params?.serviceDate,
        versionNo:                  params?.versionNo ,
        customer:                   params?.customer,
        site:                       params?.site,
        machine:                    machineId,
        technician:                 params?.technician?._id,
        technicianNotes:            params?.technicianNotes,
        textBeforeCheckItems:       params?.textBeforeCheckItems,
        textAfterCheckItems:        params?.textAfterCheckItems,
        serviceNote:                params?.serviceNote,
        recommendationNote:         params?.recommendationNote,
        internalComments:           params?.internalComments,
        suggestedSpares:            params?.suggestedSpares,
        internalNote:               params?.internalNote,
        operators:                  params?.operators,
        operatorNotes:              params?.operatorNotes,
        checkItemReportValues:      params?.checkItemReportValues,
        status:                     params?.status,
        update:                     params?.update,
        isReportDocsOnly:           params?.isReportDocsOnly,
        isActive:                   params?.isActive,
        primaryServiceReportId:     params?.primaryServiceReportId,
        emails:                     params?.emails,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}`, data );
      await dispatch(slice.actions.updateMachineServiceReportSuccess(response?.data));
      return response?.data?.serviceReport;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}

export function addMachineServiceReportFiles(machineId, id, params) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      if (Array.isArray(params?.files) &&  params?.files?.length > 0) {
        if(params?.isReportDoc){
          formData.append('isReportDoc', params?.isReportDoc );
        }
        params?.files?.forEach((file, index) => {
          if (file) {
            formData.append('images', file );
          }
        });
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/files/`,formData);
      dispatch(slice.actions.getMachineServiceReportSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


export function createMachineServiceReportVersion(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/version/`);
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function downloadReportFile(machineId, id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/files/${fileId}/download/` );
    dispatch(slice.actions.resetSubmittingCheckItemIndex());    
    return response;
  };
}

export function deleteReportFile(machineId, id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/files/${fileId}/` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
      dispatch(slice.actions.resetSubmittingCheckItemIndex());
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function downloadCheckItemFile(machineId, id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/files/${fileId}/download/` );
    dispatch(slice.actions.resetSubmittingCheckItemIndex());
    return response;
  };
}

export function deleteCheckItemFile(machineId, fileId, Index, childIndex ) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    try {
      await axios.delete(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/files/${fileId}/` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.deleteMachineServiceReportCheckItemSuccess({ Index, childIndex, checkItem: fileId }));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


export function getMachineServiceReportCheckItems(machineId, id, highQuality) {
  return async (dispatch) => {
    if(!highQuality){
      dispatch(slice.actions.startLoadingCheckItems());
    }
    try {
      const params = { }
      if( highQuality ){
        params.highQuality = true;
      }
      
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/${id}/checkItems`,{ params } );
      await dispatch(slice.actions.getMachineServiceReportCheckItemsSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function addCheckItemValues(machineId, data, Index, childIndex) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append('serviceReport', data.serviceReport);
      formData.append('primaryServiceReportId', data.primaryServiceReportId);
      formData.append('checkItemListId', data.checkItemListId);
      formData.append('machineCheckItem', data.machineCheckItem);
      formData.append('checkItemValue', data.checkItemValue);
      formData.append('comments', data.comments);
      
      if (Array.isArray(data?.images) &&  data?.images?.length > 0) {
        data?.images?.filter(image => !image.uploaded)?.forEach((image, index) => {
          if (image && !image?._id) {
            formData.append('images', image );
          }
        });
      }

      let response;
      
      if (
        data?.reportValue?._id &&
        data?.reportValue?.serviceReport?.versionNo === data?.versionNo
      ) {
        response = await axios.patch(
          `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/${data?.reportValue?._id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/`,
          formData
        );
      }
      dispatch(slice.actions.UpdateMachineServiceReportCheckItems({ Index, childIndex, checkItem: { ...response.data } }));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function sendMachineServiceReportForApproval(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        machine: machineId,
        ...params
      };
      const response = await axios.post(
        `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/sendApprovalEmail`,
        data
      );
      dispatch(slice.actions.getMachineServiceReportSuccess(response?.data));
      return response?.data
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
export function approveServiceReportRequest(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        machine: machineId,
        serviceReportId: id,
        evaluationData: params
      };
      const response = await axios.post(
        `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/approveReport`,
        data
      );
      dispatch(slice.actions.getMachineServiceReportSuccess(response?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}