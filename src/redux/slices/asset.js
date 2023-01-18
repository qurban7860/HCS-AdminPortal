import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  assets: [],
  asset: null,
  assetParams: {
    name: 0,
    status: [],
    tag: 0,
    model: 0,
    serial: 0,
    location: 0,
    department: null,
    notes: 0,
    images: []
  }
};

const slice = createSlice({
  name: 'asset',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET ASSETS
    getAssetsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.assets = action.payload;
      state.initial = true;
    },

    // GET ASSET
    getAssetSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.asset = action.payload;
      state.initial = true;
    },


    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    async saveAsset(state, action) {
      try {
        const formData = new FormData();
        console.log(action.payload.department);
        formData.append('id', action.payload.id);
        formData.append('name', action.payload.name);
        formData.append('assetTag', action.payload.tag);
        formData.append('assetModel', action.payload.model);
        if(action.payload.department){
          formData.append('department_id', action.payload.department);
        }
        formData.append('status', action.payload.status);
        formData.append('serial', action.payload.serial);
        formData.append('location', action.payload.location);
        formData.append('email', action.payload.email);
        formData.append('added_by', action.payload.addedBy);
        formData.append('image', action.payload.image);


        const response = await axios.post(`${CONFIG.SERVER_URL}assets`,
          formData,
        );


      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

    },

    async updateAsset(state, action) {
      try {

        const formData = new FormData();

        formData.append('id', action.payload.id);
        formData.append('name', action.payload.name);
        formData.append('assetTag', action.payload.tag);
        formData.append('assetModel', action.payload.model);
        if(action.payload.department){
          formData.append('department_id', action.payload.department);
        }
        formData.append('status', action.payload.status);
        formData.append('serial', action.payload.serial);
        formData.append('location', action.payload.location);
        if (action.payload.replaceImage) {
          formData.append('image', action.payload.image);
        } else {
          formData.append('imagePath', action.payload.imagePath)
        }
        const response = await axios.patch(`${CONFIG.SERVER_URL}assets/${action.payload.id}`,
          formData
        );

      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

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
  saveAsset,
  updateAsset,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function getAssets() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}assets`);
      console.log(response);
      console.log(response.data);
      dispatch(slice.actions.getAssetsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Assets loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAsset(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/assets/asset', {
        params: { name },
      });
      dispatch(slice.actions.getAssetSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Assets Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteAsset(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id);
      const response = await axios.delete(`${CONFIG.SERVER_URL}assets/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


