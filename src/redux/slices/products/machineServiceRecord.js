import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  machineServiceRecordEditFormFlag: false,
  machineServiceRecordAddFormFlag: false,
  machineServiceRecordViewFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machineServiceRecord: {},
  machineServiceRecords: [],
  activeMachineServiceRecords: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  recordTypes: [
    { _id:1 , name: 'Service'},
    { _id:2 , name: 'Repair'},
    { _id:3 , name: 'Training'},
    { _id:4 , name: 'Install'},
  ],
};

const slice = createSlice({
  name: 'machineServiceRecord',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setMachineServiceRecordEditFormVisibility(state, action){
      state.machineServiceRecordAddFormFlag = false;
      state.machineServiceRecordEditFormFlag = action.payload;
      state.machineServiceRecordViewFormFlag = false;
    },
    // SET TOGGLE
    setMachineServiceRecordAddFormVisibility(state, action){
      state.machineServiceRecordAddFormFlag = action.payload;
      state.machineServiceRecordEditFormFlag = false;
      state.machineServiceRecordViewFormFlag = false;
    },    
    // SET TOGGLE
    setMachineServiceRecordViewFormVisibility(state, action){
      state.machineServiceRecordEditFormFlag = false;
      state.machineServiceRecordAddFormFlag = false;
      state.machineServiceRecordViewFormFlag = action.payload;
    },
    // SET ALL TOGGLEs
    setAllFlagsFalse(state, action){
      state.machineServiceRecordEditFormFlag = false;
      state.machineServiceRecordAddFormFlag = false;
      state.machineServiceRecordViewFormFlag = false;
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
    getMachineServiceRecordSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceRecord = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getActiveMachineServiceRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeMachineServiceRecords = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET MACHINE TECH PARAM
    resetMachineServiceParam(state){
      state.machineServiceRecord = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM
    resetMachineServiceParams(state){
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
  setMachineServiceRecordEditFormVisibility,
  setMachineServiceRecordAddFormVisibility,
  setMachineServiceRecordViewFormVisibility,
  setAllFlagsFalse,
  resetMachineServiceRecords,
  resetMachineServiceRecord,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------
export function getActiveMachineServiceRecords (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceRecords`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      }
      );
      dispatch(slice.actions.getActiveMachineServiceRecordsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------

export function getMachineServiceRecords (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceRecords`, 
      {
        params: {
          isArchived: false
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
export function getMachineServiceRecord(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceRecords/${id}`);
      dispatch(slice.actions.getMachineServiceRecordSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteMachineServiceRecord(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceRecords/${id}` , 
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

export function addMachineServiceRecord(params) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        // const formData = new FormData();
        // formData.append('recordType',params?.recordType?.name)
        // formData.append('serviceRecordConfig',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)
        // formData.append('',params)

        /* eslint-disable */
        let data = {
          recordType:                 params?.recordType?.name,
          serviceRecordConfig:        params?.serviceRecordConfig,
          serviceDate:                params?.serviceDate,
          customer:                   params?.customer, 
          site:                       params?.site?._id,
          machine:                    params?.machine,
          decoiler:                   params?.decoiler?._id,
          technician:                 params?.technician?._id,
          // checkParams:     
          serviceNote:                params?.serviceNote,
          maintenanceRecommendation:  params?.maintenanceRecommendation,
          suggestedSpares:            params?.suggestedSpares,
          files:                      params?.files,
          // checkParamFiles: [],
          operator:                   params?.operator?._id,
          operatorRemarks:            params?.operatorRemarks,
          isActive:                   params?.isActive,
        };
        const response = await axios.post(`${CONFIG.SERVER_URL}products/serviceRecords`, data);
        dispatch(slice.actions.getMachineServiceRecordSuccess(response.data.MachineTool));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachineServiceRecord(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        name:             params?.name,
        printName:        params?.printName,
        helpHint:         params?.helpHint,
        linkToUserManual: params?.linkToUserManual,
        inputType:        params?.inputType,
        unitType:         params?.unitType,    
        minValidation:    params?.minValidation,
        maxValidation:    params?.maxValidation,
        description:      params?.description,
        isRequired:       params?.isRequired, 
        isActive:         params?.isActive,
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}products/serviceRecords/${id}`,data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}