import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  isLoadingProfileFile: false,
  error: null,
  profile: {},
  profiles: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // START LOADING File
    setLoadingFile(state, action) {
      state.isLoadingProfileFile = action.payload;;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  Profile
    getProfilesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.profiles = action.payload;
      state.initial = true;
    },

    // GET Profile
    getProfileSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.profile = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    getFileSuccess(state, action) {
      const { id, data } = action.payload;
      const fArray = state.profile.files;
      if (Array.isArray(fArray) && fArray.length > 0) {
        const fIndex = fArray.findIndex(f => f?._id === id);
        if (fIndex !== -1) {
          const uFile = { ...fArray[fIndex], src: data };
          state.profile = {
            ...state.profile,
            files: [...fArray.slice(0, fIndex), uFile, ...fArray.slice(fIndex + 1)],
          };
        }
      }
      state.isLoadingProfileFile = false;
    },


    addFilesSuccess(state, action) {
      state.profile = {
        ...state.profile,
        files: [...(state.profile?.files || []), ...(action.payload?.files || [])]
      }
      state.isLoadingProfileFile = false;
    },

    deleteFileSuccess(state, action) {
      const { id } = action.payload;
      const array = state.profile.files;
      if (Array.isArray(array) && array?.length > 0) {
        state.profile = {
          ...state.profile,
          files: state.profile?.files?.filter(f => f?._id !== id) || []
        };
      }
      state.isLoadingProfileFile = false;
    },


    // RESET LICENSE
    resetProfile(state) {
      state.profile = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetProfiles(state) {
      state.profiles = [];
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

export const ProfileTypes = ['MANUFACTURE', 'CUSTOMER']

// Actions
export const {
  setProfileFormVisibility,
  setProfileEditFormVisibility,
  setProfileViewFormVisibility,
  resetProfile,
  resetProfiles,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function addProfile(machineId, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();

      // Add profile data
      formData.append('defaultName', data.defaultName);
      formData.append('type', data.type);
      formData.append('web', data.web);
      formData.append('flange', data.flange);
      formData.append('thicknessStart', data.thicknessStart);
      formData.append('thicknessEnd', data.thicknessEnd);
      formData.append('isActive', data.isActive);

      // Add names array
      if (data.names && data.names.length > 0) {
        data.names.forEach((name) => {
          formData.append('names[]', name);
        });
      }

      // Add files
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append('images', file);
        });
      }
      await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles`, formData);
      await dispatch(setProfileFormVisibility(false));
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------


export function getProfiles(machineId, isMachineArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        isArchived: false,
        orderBy: {
          createdAt: -1
        }
      }
      if (isMachineArchived) {
        params.archivedByMachine = true;
        params.isArchived = true;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles`, { params });

      dispatch(slice.actions.getProfilesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Profiles loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getProfile(machineId, Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}`);
      dispatch(slice.actions.getProfileSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteProfile(machineId, Id) {

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}`, {
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

export async function updateProfile(machineId, Id, data) {

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();

      // Add profile data
      formData.append('defaultName', data.defaultName);
      formData.append('type', data.type);
      formData.append('web', data.web);
      formData.append('flange', data.flange);
      formData.append('thicknessStart', data.thicknessStart);
      formData.append('thicknessEnd', data.thicknessEnd);
      formData.append('isActive', data.isActive);

      // Add names array
      if (data.names && data.names.length > 0) {
        data.names.forEach((name) => {
          formData.append('names[]', name);
        });
      }

      // Add files
      if (data.files && data.files.length > 0) {
        data.files.forEach((file) => {
          formData.append('images', file);
        });
      }

      await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}`, formData);
      await dispatch(setProfileEditFormVisibility(false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}


export function getFile(machineId, Id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}/files/${fileId}`);
      dispatch(slice.actions.getFileSuccess({ id: fileId, data: response.data }));
      return response;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function addFiles(machineId, Id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      const formData = new FormData();
      (params?.files || []).forEach((file, index) => {
        formData.append(`images`, file);
      });
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}/files/`, formData);
      dispatch(slice.actions.addFilesSuccess(response.data));
      return response;
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteFile(machineId, Id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      await axios.delete(`${CONFIG.SERVER_URL}products/machines/${machineId}/profiles/${Id}/files/${fileId}`);
      dispatch(slice.actions.deleteFileSuccess({ id: fileId }));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}