import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

const initialState = {
  isLoading: false,
  customerRegistrations: [],
  customerRegistration: {},
  filterBy: '',
  filterStatus: "",
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'customerRegistration',
  initialState,
  reducers: {

    startLoading(state) {
      state.isLoading = true;
    },

    stopLoading(state) {
      state.isLoading = false;
    },

    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
    },

    getCustomerRegistrationsSuccess(state, action) {
      state.isLoading = false;
      state.customerRegistrations = action.payload;
    },

    getCustomerRegistrationSuccess(state, action) {
      state.isLoading = false;
      state.customerRegistration = action.payload;
    },

    resetCustomerRegistration(state){
      state.customerRegistration = null;
    },

    resetCustomerRegistrations(state){
      state.customerRegistrations = [];
      state.isLoading = false;
    },

    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },

    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },

    ChangePage(state, action) {
      state.page = action.payload;
    },
    
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetCustomerRegistration,
  resetCustomerRegistrations,
  setFilterBy,
  setFilterStatus,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getCustomerRegistrations( page, pageSize ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {

        orderBy: {
          createdAt: -1
        } 
      }
      if( page && pageSize ){
        params.pagination = {
          page,
          pageSize,
        }
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/register`, { params });
      dispatch(slice.actions.getCustomerRegistrationsSuccess(response.data));
      return response
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getCustomerRegistration(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/register/${id}`);
      dispatch(slice.actions.getCustomerRegistrationSuccess(response.data));
      return response
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteCustomerRegistration(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`${CONFIG.SERVER_URL}crm/customers/register/${id}`);
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function updateCustomerRegistration( Id, params ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const data = {
        customerName: params?.customerName,
        contactPersonName: params?.contactPersonName,
        email: params?.email,
        phoneNumber: params?.phoneNumber,
        address: params?.address,
        status: params?.status,
        customerNote: params?.customerNote,
        internalRemarks: params?.internalRemarks,
        machineSerialNos: params?.machineSerialNos,
        isActive: params?.isActive,
        isArchived: params?.isArchived,
      };

      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/register/${Id}`, data );
      return response
    
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}