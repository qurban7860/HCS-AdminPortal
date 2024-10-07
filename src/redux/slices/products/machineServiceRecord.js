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
  machineServiceRecord: {},
  machineServiceRecords: [],
  machineServiceRecordHistory: [],
  activeMachineServiceRecords: [],
  machineServiceRecordCheckItems: [],
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
  name: 'machineServiceRecord',
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
    getMachineServiceRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceRecords = action.payload;
      state.initial = true;
    },
    // GET MACHINE SERVICE PARAM
    getMachineServiceRecordHistorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceRecordHistory = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getActiveMachineServiceRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeMachineServiceRecords = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getMachineServiceRecordSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceRecord = action.payload;
      state.initial = true;
    },


    getMachineServiceRecordCheckItemsSuccess(state, action) {
      state.isLoadingCheckItems = false;
      state.isLoading = false;
      state.success = true;
      state.machineServiceRecordCheckItems = action.payload;
      state.initial = true;
    },

    UpdateMachineServiceRecordCheckItems(state, action) {
      const { Index, childIndex, checkItem } = action.payload;
      state.machineServiceRecordCheckItems.checkItemLists[Index].checkItems[childIndex].recordValue = {
        ...state.machineServiceRecordCheckItems.checkItemLists[Index].checkItems[childIndex].recordValue,
        comments: checkItem.comments	,
        checkItemValue: checkItem.checkItemValue,
        files: [ ...state.machineServiceRecordCheckItems.checkItemLists[Index].checkItems[childIndex].recordValue.files,
        ...checkItem.files
        ]
      };
    },

    deleteMachineServiceRecordCheckItemSuccess(state, action) {
      const { Index, childIndex, checkItem } = action.payload;
      const checkItemFiles = [ ...state.machineServiceRecordCheckItems.checkItemLists[Index].checkItems[childIndex].recordValue.files ] 
      state.machineServiceRecordCheckItems.checkItemLists[Index].checkItems[childIndex].recordValue = {
        ...state.machineServiceRecordCheckItems.checkItemLists[Index].checkItems[childIndex].recordValue,
        files: checkItemFiles?.filter(file => file._id !== checkItem )
      };
    },

    
    // GET MACHINE Active SERVICE PARAM
    updateMachineServiceRecordSuccess( state, action ) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceRecord = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    addMachineServiceRecordFilesSuccess(state) {
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
    resetMachineServiceRecord(state){
      state.machineServiceRecord = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM
    resetCheckItemValues(state){
      state.checkItemRecordValues = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoadingCheckItems = false;
    },

    // RESET MACHINE TECH PARAM
    resetMachineServiceRecords(state){
      state.machineServiceRecords = [];
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
  resetMachineServiceRecords,
  resetMachineServiceRecord,
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
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${data.id}/sendEmail`, formData );
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getActiveMachineServiceRecords (machineId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      }
      );
      await dispatch(slice.actions.getActiveMachineServiceRecordsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

export function getMachineServiceHistoryRecords(machineId, serviceId ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords`, 
      {
        params: {
          isArchived: false,
          // isHistory: true,
          serviceId,
        }
      }
      );
      dispatch(slice.actions.getMachineServiceRecordHistorySuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------

export function getMachineServiceRecordVersion(machineId, id ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      await dispatch(resetMachineServiceRecord());
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/values`);
      dispatch(slice.actions.getMachineServiceRecordSuccess(response.data));
      dispatch(setHistoricalFlag(true));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------


export function getMachineServiceRecords (machineId, isMachineArchived){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const params = {
        isArchived: false,
        $or: [
            { isHistory: false },
            { status: 'DRAFT' }
          ],
        orderBy : {
          createdAt: -1
        }
      }
    if(isMachineArchived){
      params.archivedByMachine = true;
      params.isArchived = true;
    }
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords`, { params } );
      dispatch(slice.actions.getMachineServiceRecordsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}


// ----------------------------------------------------------------------
export function getMachineServiceRecord(machineId, id, isHighQuality ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {};
      if(isHighQuality){
        params.isHighQuality = true;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}`,{ params });
      dispatch(slice.actions.getMachineServiceRecordSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteMachineServiceRecord(machineId, id, status ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}` , 
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

export function addMachineServiceRecord(machineId, params) {
    return async (dispatch) => {
      // dispatch(slice.actions.startLoading());
      try {
        const data = {
          serviceRecordConfig:        params?.serviceRecordConfiguration?._id,
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
          checkItemRecordValues:      params?.checkItemRecordValues || [],
          isReportDocsOnly:           params?.isReportDocsOnly,
          isActive:                   params?.isActive
        }
        // const formData = new FormData();
        // formData.append('serviceRecordConfig', params?.serviceRecordConfiguration?._id || null);
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
        // formData.append('checkItemRecordValues', JSON.stringify(params?.checkItemRecordValues || []));
        // formData.append('isActive', params?.isActive);

        // if (Array.isArray(params?.files) &&  params?.files?.length > 0) {
        //   params?.files?.forEach((file, index) => {
        //     if (file) {
        //       formData.append('images', file );
        //     }
        //   });
        // }
        
        const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords`, data );
        dispatch(slice.actions.getMachineServiceRecordSuccess(response.data));

        return response?.data;

      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachineServiceRecord(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        // serviceRecordConfig:        params?.serviceRecordConfiguration,
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
        checkItemRecordValues:      params?.checkItemRecordValues,
        status:                     params?.status || 'DRAFT',
        update:                     params?.update,
        isReportDocsOnly:           params?.isReportDocsOnly,
        isActive:                   params?.isActive,
        serviceId:                  params?.serviceId,
        emails:                     params?.emails,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}`, data );
      await dispatch(slice.actions.updateMachineServiceRecordSuccess(response?.data));
      return response?.data?.serviceRecord;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}

export function addMachineServiceRecordFiles(machineId, id, params) {
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
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/files/`,formData);
      dispatch(slice.actions.getMachineServiceRecordSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


export function createMachineServiceRecordVersion(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/version/`);
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function downloadRecordFile(machineId, id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/files/${fileId}/download/` );
    dispatch(slice.actions.resetSubmittingCheckItemIndex());    
    return response;
  };
}

export function deleteRecordFile(machineId, id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/files/${fileId}/` , 
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
    const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecordValues/files/${fileId}/download/` );
    dispatch(slice.actions.resetSubmittingCheckItemIndex());
    return response;
  };
}

export function deleteCheckItemFile(machineId, fileId, Index, childIndex ) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    try {
      await axios.delete(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecordValues/files/${fileId}/` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.deleteMachineServiceRecordCheckItemSuccess({ Index, childIndex, checkItem: fileId }));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


export function getMachineServiceRecordCheckItems(machineId, id, highQuality) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoadingCheckItems());
    try {
      const params = { }
      if( highQuality ){
        params.highQuality = true;
      }
      
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecordValues/${id}/checkItems`,{ params } );
      dispatch(slice.actions.getMachineServiceRecordCheckItemsSuccess(response.data));
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
      formData.append('serviceRecord', data.serviceRecord);
      formData.append('serviceId', data.serviceId);
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
        data?.recordValue?._id &&
        data?.recordValue?.serviceRecord?.versionNo === data?.versionNo
      ) {
        response = await axios.patch(
          `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecordValues/${data?.recordValue?._id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecordValues/`,
          formData
        );
      }
      dispatch(slice.actions.UpdateMachineServiceRecordCheckItems({ Index, childIndex, checkItem: { ...response.data } }));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function sendMachineServiceRecordForApproval(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        machine: machineId,
        ...params
      };
      const response = await axios.post(
        `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/sendApprovalEmail`,
        data
      );
      dispatch(slice.actions.getMachineServiceRecordSuccess(response?.data));
      return response?.data
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
export function approveServiceRecordRequest(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        machine: machineId,
        serviceRecordId: id,
        evaluationData: params
      };
      const response = await axios.post(
        `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/approveRecord`,
        data
      );
      dispatch(slice.actions.getMachineServiceRecordSuccess(response?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}