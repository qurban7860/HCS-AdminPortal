import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  supplierEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  suppliers: [],
  supplier: {},
  supplierParams: {
  }
};

const slice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setSupplierEditFormVisibility(state, action){
      state.supplierEditFormFlag = action.payload;
    },
    
    // RESET CUSTOMER
    resetSupplier(state){
      state.machine = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Customers
    getSuppliersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.suppliers = action.payload;
      state.initial = true;
    },

    // GET Customer
    getSupplierSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.supplier = action.payload;
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
  setSupplierEditFormVisibility,
  resetSupplier,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

//------------------------------------------------------------------------------

export function getSuppliers (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/suppliers`);
      dispatch(slice.actions.getSuppliersSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Suppliers loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message))
    }
  }
}
// ----------------------------------------------------------------------

export function getSupplier(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/suppliers/${id}`);
      dispatch(slice.actions.getSupplierSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

//------------------------------------------------------------------------------------------
export function deleteSupplier(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/suppliers/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// --------------------------------------------------------------------------

export function addSupplier(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetSupplier());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
        id: params.id,
        name: params.name,
        isActive: params.isActive,
        };
        /* eslint-enable */
        if(params.contactName){
          data.contactName = params.contactName;
        }
        if(params.contactTitle){
          data.contactTitle = params.contactTitle;
        }
        if(params.phone){
          data.phone = params.phone;
        }
        if(params.email){
          data.email = params.email;
        }
        if(params.fax){
          data.fax = params.fax;        
        }
        if(params.website){
          data.website = params.website;        
        }
        if(params.street || params.subrub || params.city || params.region || params.country) {
          data.address = {}
        }
        if(params.street){
          data.address.street = params.street;        
        }
        if(params.suburb){
          data.address.suburb = params.suburb;        
        }
        if(params.city){
          data.address.city = params.city;        
        }
        if(params.postcode){
          data.address.postcode = params.postcode;        
        }
        if(params.region){
          data.address.region = params.region;        
        }
        if(params.country){
          data.address.country = params.country;        
        }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/suppliers`, data);
        dispatch(slice.actions.getSupplierSuccess(response.data.Supplier));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
      }
    };

}

// --------------------------------------------------------------------------

export function updateSupplier(params,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        id: params.id,
        name: params.name,
        isActive: params.isActive,
        contactName: params.contactName,
        contactTitle: params.contactTitle,
        phone: params.phone,
        email: params.email,
        website: params.website,
        fax: params.fax,
        address: {
          street: params.street,
          suburb: params.suburb,
          city: params.city,
          postcode: params.postcode,
          region: params.region,
          country: params.country,
        }
      };
     /* eslint-enable */
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/suppliers/${Id}`,
        data
      );
      dispatch(getSupplier(Id));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}