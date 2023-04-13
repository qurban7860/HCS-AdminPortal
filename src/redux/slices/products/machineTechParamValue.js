// import sum from 'lodash/sum';
// import uniq from 'lodash/uniq';
// import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';




// ----------------------------------------------------------------------

const initialState = {
  formVisibility: false,
  settingEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  settings: [],
  setting: null,
  settingParams: {

  }
};

const slice = createSlice({
  name: 'machineSetting',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;

    },
    // SET TOGGLE
    setSettingFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setSettingEditFormVisibility(state, action){
      state.settingEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Setting
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


    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setSettingFormVisibility,
  setSettingEditFormVisibility,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------Save Note------------------------------------------

export function saveSetting(machineId,params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
            const data = {
                techParam: params.techParam,
                techParamValue: params.techParamValue,
                isActive: params.isActive,
            }
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/`, data);
    //   dispatch(slice.actions.setSettingFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Setting saved successfully'));
      dispatch(getSettings(machineId));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Note-------------------------------------

export function updateSetting(machineId,settingId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        techParam: params.techParam,
        techParamValue: params.techParamValue,
        isActive: params.isActive,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`, data, );
      dispatch(slice.actions.setResponseMessage('Setting updated successfully'));
      dispatch(setSettingEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Settings-----------------------------------

export function getSettings(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${id}/techparamvalues` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getSettingsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Setting loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get Setting---------------------------------------

export function getSetting(machineId,settingId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`);
      dispatch(slice.actions.getSettingSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Setting Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive Note-------------------------------------

export function deleteSetting(machineId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.delete(`${CONFIG.SERVER_URL}customers/notes/${id}`,
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${id}` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}


