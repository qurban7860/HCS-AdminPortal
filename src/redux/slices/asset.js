import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  success: false,
  isLoading: false,
  error: null,
  assets: [],
  asset: null,
  values: {
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
    },

    // GET ASSETS
    getAssetsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.assets = action.payload;
    },

    // GET ASSETS
    getAssetSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.asset = action.payload;
    },


    async saveAsset(state, action){
      try {
        
        const formData = new FormData();

        formData.append('id',action.payload.id);
        formData.append('name', action.payload.name);
        formData.append('assetTag', action.payload.tag);
        formData.append('assetModel', action.payload.model);
        formData.append('department', action.payload.department);
        formData.append('status', action.payload.status);
        formData.append('serial', action.payload.serial);
        formData.append('notes', action.payload.notes);
        formData.append('location', action.payload.location);
        formData.append('email', action.payload.email);
        console.log('formdata', formData);

        if(action.payload.editAsset){
          console.log('update');
          if(action.payload.replaceImage){
            formData.append('replaceImage', action.payload.replaceImage);
            formData.append('image', action.payload.image);
          }
          const response = await axios.patch('http://localhost:5000/api/1.0.0/assets',
          action.payload.id 
          );
        }
        
        else{
          console.log('add');
          formData.append('image', action.payload.image);
          const response = await axios.post('http://localhost:5000/api/1.0.0/assets', 
          formData,
          );
        }
        
      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }
      
    },
    async deleteAsset(state, action){
      try{
        const assetID = action.payload;
        console.log(action.payload)
        const response = await axios.delete('http://localhost:5000/api/1.0.0/assets', {
          assetID
        });
        const { asset } = response.data;
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
  deleteAsset,
  getCart,
  addToCart,
  resetCart,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function getAssets() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:5000/api/1.0.0/assets');
      console.log(response.data);
      dispatch(slice.actions.getAssetsSuccess(response.data.assets));
    } catch (error) {
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
      dispatch(slice.actions.getAssetSuccess(response.data.asset));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getAssetLocations() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    // try {

    // } catch (error) {
    //   console.error(error);
    //   dispatch(slice.actions.hasError(error));
    // }
  };
}

// ----------------------------------------------------------------------

export function getAssetDepartments() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    // try {

    // } catch (error) {
    //   console.error(error);
    //   dispatch(slice.actions.hasError(error));
    // }
  };
}

// ----------------------------------------------------------------------

export function getAssetModels() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    // try {

    // } catch (error) {
    //   console.error(error);
    //   dispatch(slice.actions.hasError(error));
    // }
  };
}