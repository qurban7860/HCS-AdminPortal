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

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const totalItems = sum(cart.map((asset) => asset.quantity));
      const subtotal = sum(cart.map((asset) => asset.price * asset.quantity));
      state.checkout.cart = cart;
      state.checkout.discount = state.checkout.discount || 0;
      state.checkout.shipping = state.checkout.shipping || 0;
      state.checkout.billing = state.checkout.billing || null;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - state.checkout.discount;
      state.checkout.totalItems = totalItems;
    },

    async saveAsset(state, action){
      try {
        console.log('id', action.payload.model);
        
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
          const response = await axios.post('http://localhost:5000/api/assets/updateAsset', 
          formData,
          );
        }
        
        else{
          console.log('add');
          formData.append('image', action.payload.image);
          const response = await axios.post('http://localhost:5000/api/assets/saveAsset', 
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
        const response = await axios.post('http://localhost:5000/api/assets/deleteAsset', {
          assetID
        });
        const { asset } = response.data;
      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter((asset) => asset.id !== action.payload);

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.cart = [];
      state.checkout.billing = null;
      state.checkout.activeStep = 0;
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.totalItems = 0;
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
  createBilling,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
} = slice.actions;

// ----------------------------------------------------------------------

export function getAssets() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('http://localhost:5000/api/assets/getAllAssets');
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
