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
      // console.log('toggle', action.payload);
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setSettingEditFormVisibility(state, action){
      // console.log('setEditFormVisibility', action.payload);
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
            }
            console.log("Setting Param : ",params , " Data : ",data);
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/`, data);
      console.log(response)
    //   dispatch(slice.actions.setSettingFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Setting saved successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------Update Note-------------------------------------

export function updateSetting(machineId,settingId,params) {
  console.log("update Setting params : ", params);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        techParam: params.techParam,
        techParamValue: params.techParamValue,
      }
      console.log("Update before post: ",data)
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/techparamvalues/${settingId}`, data, );
      dispatch(slice.actions.setResponseMessage('Setting updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
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
      console.log("Settings Response : ",response);
      dispatch(slice.actions.getSettingsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Notes loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
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
      // console.log('requested note', response.data);
      // dispatch(slice.actions.setResponseMessage('Notes Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
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
      // console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


