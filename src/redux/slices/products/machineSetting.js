import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  settingFormVisibility: false,
  settingViewFormVisibility: false,
  settingEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  setting: {},
  settings: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machineSetting',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET ADD FORM TOGGLE
    setSettingFormVisibility(state, action){
      state.settingFormVisibility = action.payload;
    },

    // SET EDIT FORM TOGGLE
    setSettingEditFormVisibility(state, action){
      state.settingEditFormVisibility = action.payload;
    },

    // SET VIEW TOGGLE
    setSettingViewFormVisibility(state, action){
      state.settingViewFormVisibility = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  Setting
    getSettingsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.settings = action.payload;
      state.initial = true;
    },

    // GET Setting
    getSettingSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.setting = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET LICENSE
    resetSetting(state){
      state.setting = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetSettings(state){
      state.settings = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },


    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
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
  setSettingFormVisibility,
  setSettingEditFormVisibility,
  setSettingViewFormVisibility,
  resetSetting,
  resetSettings,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function addSetting (machineId, params){

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
          techParam: params.techParam,
          techParamValue: params.techParamValue,
          machines: params.machines?.map(el => el?._id) || [],
          isActive: params.isActive,
      }
      await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/`, data);
      dispatch(slice.actions.setResponseMessage('Setting saved successfully'));
      dispatch(getSettings(machineId));
      await dispatch(setSettingFormVisibility(false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------


export function getSettings (id ){

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${id}/techparamvalues` , 
      {
        params: {
          isArchived: false,
          orderBy : {
            createdAt:-1
          }
        }
      }
      );
      dispatch(slice.actions.getSettingsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Setting loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getSetting(machineId, settingId) {

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`);
      dispatch(slice.actions.getSettingSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Setting Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function deleteSetting(machineId, Id) {

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${Id}`, {
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

export async function updateSetting(machineId,settingId,params) {

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        techParamValue: params.techParamValue,
        isActive: params.isActive,
      }
      await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`, data, );
      dispatch(slice.actions.setResponseMessage('Setting updated successfully'));
      dispatch(setSettingEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}