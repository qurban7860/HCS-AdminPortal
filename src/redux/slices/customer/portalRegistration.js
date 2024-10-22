import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

const initialState = {
  isLoading: false,
  portalRegistrations: [],
  portalRegistration: {},
  hiddenColumns: {
    "contactPersonName": false,
    "email": false,
    "phoneNumber": false,
    "address": false,
    "customerName": false,
    "machineSerialNos": false,
    "status": false,
    "customer.name": true,
    "contact.firstName": true,
    "createdAt": false
  },
  filterBy: '',
  filterStatus: null,
  page: 0,
  rowsPerPage: 100,
  acceptRequestDialog: false,
  rejectRequestDialog: false,
};

const slice = createSlice({
  name: 'portalRegistration',
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

    setHiddenColumns(state, action) {
      state.hiddenColumns = action.payload;
    },

    setAcceptRequestDialog(state, action) {
      state.acceptRequestDialog = action.payload;
    },

    setRejectRequestDialog(state, action) {
      state.rejectRequestDialog = action.payload;
    },
    
    getPortalRegistrationsSuccess(state, action) {
      state.isLoading = false;
      state.portalRegistrations = action.payload;
    },

    getPortalRegistrationSuccess(state, action) {
      state.isLoading = false;
      state.portalRegistration = action.payload;
    },

    resetPortalRegistration(state){
      state.portalRegistration = null;
    },

    resetPortalRegistrations(state){
      state.portalRegistrations = [];
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
  resetPortalRegistration,
  resetPortalRegistrations,
  setFilterBy,
  setFilterStatus,
  setAcceptRequestDialog,
  setRejectRequestDialog,
  setHiddenColumns,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getPortalRegistrations( page, pageSize ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        isArchived: false,
        pagination: {
          page,
          pageSize,
        },
        orderBy: {
          createdAt: -1
        } 
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/register`, { params });
      dispatch(slice.actions.getPortalRegistrationsSuccess(response.data));
      return response
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getPortalRegistration(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/register/${id}`);
      dispatch(slice.actions.getPortalRegistrationSuccess(response.data));
      return response
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deletePortalRegistration(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.delete(`${CONFIG.SERVER_URL}crm/customers/register/${id}`);
      dispatch(slice.actions.stopLoading());
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}

// --------------------------------------------------------------------------
export function updatePortalRegistration(Id, params) {
  return async (dispatch) => {
    try {
      const data = {
        customer: params?.customer?._id,
        contact: params?.contact?._id,
        roles: params?.roles?.map(role => role?._id ),
        customerName: params?.customerName,
        contactPersonName: params?.contactPersonName,
        email: params?.email,
        phoneNumber: params?.phoneNumber,
        address: params?.address,
        status: params?.status,
        customerNote: params?.customerNote,
        internalNote: params?.internalNote,
        machineSerialNos: (Array.isArray(params?.machineSerialNos) && params?.machineSerialNos?.length > 0) 
          ? params?.machineSerialNos 
          : undefined,
        isActive: params?.isActive,
        isArchived: params?.isArchived,
      };

      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/register/${Id}`, data);
      dispatch(slice.actions.getPortalRegistrationSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.stopLoading());
      throw error;
    }
  };
}

