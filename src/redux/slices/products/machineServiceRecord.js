import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  resetFlags: true,
  machineServiceRecordEditFormFlag: false,
  machineServiceRecordAddFormFlag: false,
  machineServiceRecordViewFormFlag: false,
  machineServiceRecordHistoryFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machineServiceRecord: {},
  machineServiceRecords: [],
  machineServiceRecordHistory: [],
  activeMachineServiceRecords: [],
  sendEmailDialog:false,
  pdfViewerDialog:false,
  addFileDialog:false,
  isHistorical: false,
  isDetailPage: false,
  filterBy: '',
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

    setResetFlags (state, action){
      state.resetFlags = action.payload;
    },
    // SET TOGGLE
    setMachineServiceRecordEditFormVisibility(state, action){
      state.machineServiceRecordAddFormFlag = false;
      state.machineServiceRecordEditFormFlag = action.payload;
      state.machineServiceRecordHistoryFormFlag = false;
      state.machineServiceRecordViewFormFlag = false;
      state.isHistorical = false;
    },
    // SET TOGGLE
    setMachineServiceRecordAddFormVisibility(state, action){
      state.machineServiceRecordAddFormFlag = action.payload;
      state.machineServiceRecordEditFormFlag = false;
      state.machineServiceRecordHistoryFormFlag = false;
      state.machineServiceRecordViewFormFlag = false;
      state.isHistorical = false;
    },    
    // SET TOGGLE
    setMachineServiceRecordViewFormVisibility(state, action){
      state.machineServiceRecordEditFormFlag = false;
      state.machineServiceRecordAddFormFlag = false;
      state.machineServiceRecordHistoryFormFlag = false;
      state.isHistorical = false;
      state.machineServiceRecordViewFormFlag = action.payload;
    },
    // SET HISTORY TOGGLE
    setMachineServiceRecordHistoryFormVisibility(state, action){
      state.machineServiceRecordEditFormFlag = false;
      state.machineServiceRecordAddFormFlag = false;
      state.machineServiceRecordViewFormFlag = false;
      state.machineServiceRecordHistoryFormFlag = action.payload;
    },
    // SET ALL TOGGLEs
    setAllFlagsFalse(state, action){
      state.machineServiceRecordEditFormFlag = false;
      state.machineServiceRecordAddFormFlag = false;
      state.machineServiceRecordViewFormFlag = false;
      state.machineServiceRecordHistoryFormFlag = false;
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

    // GET MACHINE Active SERVICE PARAM
    updateMachineServiceRecordSuccess(state) {
      state.isLoading = false;
      state.success = true;
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
  setMachineServiceRecordEditFormVisibility,
  setMachineServiceRecordAddFormVisibility,
  setMachineServiceRecordViewFormVisibility,
  setMachineServiceRecordHistoryFormVisibility,
  setHistoricalFlag,
  setDetailPageFlag,
  setAllFlagsFalse,
  setSendEmailDialog,
  setPDFViewerDialog,
  setAddFileDialog,
  resetMachineServiceRecords,
  resetMachineServiceRecord,
  setResponseMessage,
  setFilterBy,
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


export function getMachineServiceRecords (machineId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords`, 
      {
        params: {
          isArchived: false,
          isHistory: false,
        }
      }
      );
      dispatch(slice.actions.getMachineServiceRecordsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}


// ----------------------------------------------------------------------
export function getMachineServiceRecord(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}`);
      dispatch(slice.actions.getMachineServiceRecordSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteMachineServiceRecord(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}` , 
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

// --------------------------------------------------------------------------

export function addMachineServiceRecord(machineId,params) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const data = {
          serviceRecordConfig:        params?.serviceRecordConfiguration?._id || null,
          serviceDate:                params?.serviceDate,
          versionNo:                  params?.versionNo,
          customer:                   params?.customer || null,
          site:                       params?.site || null,
          machine:                    machineId,
          decoilers:                  params?.decoilers?.map((dec)=> dec?._id) || [],
          technician:                 params?.technician?._id || null,
          technicianNotes:            params?.technicianNotes,
          textBeforeCheckItems:       params?.textBeforeCheckItems,
          textAfterCheckItems:        params?.textAfterCheckItems,
          serviceNote:                params?.serviceNote,
          recommendationNote:         params?.recommendationNote,
          internalComments:           params?.internalComments,
          suggestedSpares:            params?.suggestedSpares,
          internalNote:               params.internalNote,
          operators:                  params?.operators?.map((ope)=> ope?._id) || [],
          operatorNotes:              params.operatorNotes,
          checkItemRecordValues:      params?.checkItemRecordValues || [],
          isActive:                   params?.isActive
        }
        /* eslint-disable */

        const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords`, data );
        await dispatch(resetMachineServiceRecord());
        dispatch(slice.actions.getMachineServiceRecordSuccess(response.data.MachineTool));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachineServiceRecord(machineId,id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        serviceRecordConfig:        params?.serviceRecordConfiguration,
        serviceDate:                params?.serviceDate,
        versionNo:                  params?.versionNo,
        customer:                   params?.customer || null,
        site:                       params?.site || null,
        machine:                    machineId,
        decoilers:                  params?.decoilers?.map((dec)=> dec?._id) || [],
        technician:                 params?.technician?._id || null,
        technicianNotes:            params?.technicianNotes,
        textBeforeCheckItems:       params?.textBeforeCheckItems,
        textAfterCheckItems:        params?.textAfterCheckItems,
        serviceNote:                params?.serviceNote,
        recommendationNote:         params?.recommendationNote,
        internalComments:           params?.internalComments,
        suggestedSpares:            params?.suggestedSpares,
        internalNote:               params.internalNote,
        operators:                  params?.operators,
        operatorNotes:              params.operatorNotes,
        checkItemRecordValues:      params?.checkItemRecordValues || [],
        serviceId:                  params?.serviceId,
        isActive:                   params?.isActive
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}`,data);
      dispatch(slice.actions.updateMachineServiceRecordSuccess());
      return response?.data?.serviceRecord?._id;
      // await dispatch(getMachineServiceRecord(machineId, response?.data?.serviceRecord?._id))
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}

export function addMachineServiceRecordFiles(machineId, id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      if (Array.isArray(params?.files) &&  params?.files?.length > 0) {
        params?.files?.forEach((file, index) => {
          if (file) {
            formData.append('images', file );
          }
        });
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/upload`,formData);
      dispatch(slice.actions.addMachineServiceRecordFilesSuccess());
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function downloadFile(machineId, id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/files/${fileId}/download/` );
    return response;
  };
}

export function deleteFile(machineId, id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceRecords/${id}/files/${fileId}/delete` , 
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