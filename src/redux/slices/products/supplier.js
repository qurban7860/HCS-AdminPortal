import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

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
      console.log('toggle', action.payload);
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
      console.log('supplierSuccessSlice', state.supplier);
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


// ----------------------------------------------------------------------

export function createSuppliers (supplyData){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    console.log(supplyData)
    try{
      const response = await axios.post(`${CONFIG.SERVER_URL}products/suppliers`,supplyData);
      // dispatch(slice.actions)
      console.log(response,"From supplyer data");
    } catch (e) {
      console.log(e);
      dispatch(slice.actions.hasError(e))
    }
  }
}

// ----------------------------------------------------------------------


export function getSuppliers (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/suppliers`);

      dispatch(slice.actions.getSuppliersSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Suppliers loaded successfully'));
      // dispatch(slice.actions)
      console.log(response,"From supplyer data");
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error))
    }
  }
}
// ----------------------------------------------------------------------

export function getSupplier(id) {
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/suppliers/${id}`);
      dispatch(slice.actions.getSuppliersSuccess(response.data));
      console.log('requested supplier', response.data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function deleteSupplier(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/suppliers/${id}`);
      // const response = await axios.delete(`${CONFIG.SERVER_URL}machines/suppliers`,ids);
      dispatch(slice.actions.setResponseMessage(response.data));
      // get again suppliers //search
      
      console.log(response);
      // console.log(CONFIG.SERVER_URL[0])
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// --------------------------------------------------------------------------

export function saveSupplier(params) {
    return async (dispatch) => {
      console.log('params', params);
      dispatch(slice.actions.resetSupplier());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
        id: params.id,
        name: params.name,
        isDisabled: params?.isDisabled,
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
        if(params.street){
          data.address.street = params.street;        
        }
        if(params.suburb){
          data.address.suburb = params.suburb;        
        }
        if(params.city){
          data.address.city = params.city;        
        }
        if(params.region){
          data.address.region = params.region;        
        }
        if(params.country){
          data.address.country = params.country;        
        }
        

        const response = await axios.post(`${CONFIG.SERVER_URL}products/suppliers`, data);

        console.log('response', response.data.Supplier);
        dispatch(slice.actions.getSupplierSuccess(response.data.Supplier));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }
    };

}

// --------------------------------------------------------------------------

export function updateSupplier(params) {
  console.log('update, working', params)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const formData = new FormData();
      /* eslint-disable */
      let data = {
        id: params.id,
        name: params.name,
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
      if(params.website){
        data.website = params.website;        
      }
      if(params.fax){
        data.fax = params.fax;        
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
      if(params.region){
        data.address.region = params.region;        
      }
      if(params.country){
        data.address.country = params.country;        
      }
      if(params.isDisabled){
        data.isDisabled = params.isDisabled;
      }
      
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/suppliers/${params.id}`,
        data
      );

      dispatch(getSupplier(params.id));
      dispatch(slice.actions.setSupplierEditFormVisibility(false));

      // this.updateCustomerSuccess(response);

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };

}