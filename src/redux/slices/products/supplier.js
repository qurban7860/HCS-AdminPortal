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
  activeSuppliers: [],
  supplier: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
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

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Supplier
    getSuppliersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.suppliers = action.payload;
      state.initial = true;
    },

    // GET Active Supplier
    getActiveSuppliersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeSuppliers = action.payload;
      state.initial = true;
    },

    // GET Supplier
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

    // RESET SUPPLIERS
    resetSupplier(state){
      state.supplier = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SUPPLIERS
    resetSuppliers(state){
      state.suppliers = [];
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
  setSupplierEditFormVisibility,
  resetSupplier,
  resetSuppliers,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

//------------------------------------------------------------------------------

export function getSuppliers (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/suppliers`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getSuppliersSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Suppliers loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

//------------------------------------------------------------------------------

export function getActiveSuppliers (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/suppliers`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      dispatch(slice.actions.getActiveSuppliersSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Suppliers loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
      throw error;
    }
  };
}

//------------------------------------------------------------------------------------------
export function deleteSupplier(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/suppliers/${id}` , 
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
        isDefault: params.isDefault,
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
          country: params.country.label,
        }
        };
        /* eslint-enable */
        const response = await axios.post(`${CONFIG.SERVER_URL}products/suppliers`, data);
        dispatch(slice.actions.getSupplierSuccess(response.data.Supplier));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
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
        isDefault: params.isDefault,
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
          country: params.country.label,
        }
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}products/suppliers/${Id}`,
        data
      );
      dispatch(getSupplier(Id));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}