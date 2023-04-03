import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  machineEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machines: [],
  machine: {},
  machineParams: {
  }
};

const slice = createSlice({
  name: 'machine',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setMachineEditFormVisibility(state, action){
      state.machineEditFormFlag = action.payload;
    },
    
    // RESET Machine
    resetMachine(state){
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

    // GET Machines
    getMachinesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machines = action.payload;
      state.initial = true;
    },

    // GET Machine
    getMachineSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.machine = action.payload;
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
  setMachineEditFormVisibility,
  resetMachine,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function getMachines() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getMachinesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machines loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getMachine(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${id}`);
      dispatch(slice.actions.getMachineSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteMachine(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${id}`,
      {
        isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// --------------------------------------------------------------------------
 
export function saveMachine(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetMachine());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
        };
        /* eslint-enable */
        
        if(params.serialNo){
          data.serialNo = params.serialNo;        
        }
        if(params.parentMachine){
          data.parentMachine = params.parentMachine;        
        }
        if(params.parentSerialNo){
          data.parentSerialNo = params.parentSerialNo;        
        }
        if(params.status){
          data.status = params.status;        
        }
        if(params.supplier){
          data.supplier = params.supplier;        
        }
        if(params.machineModel){
            data.machineModel = params.machineModel;        
        }
        if(params.workOrderRef){
          data.workOrderRef = params.workOrderRef;        
        }
        if(params.customer){
          data.customer = params.customer;        
        }
        if(params.billingSite){
          data.billingSite = params.billingSite;        
        }
        if(params.instalationSite){
          data.instalationSite = params.instalationSite;        
        }
        if(params.accountManager){
          data.accountManager = params.accountManager;        
        }
        if(params.projectManager){
            data.projectManager = params.projectManager;        
        }
        if(params.supportManager){
            data.supportManager = params.supportManager;        
        }
        if(params.description){
          data.description = params.description;        
        }
        if(params.customerTags){
          data.customerTags = params.customerTags;        
        }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/machines`, data);

        dispatch(slice.actions.getMachineSuccess(response.data.Machine));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachine(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();

      const data = {
        serialNo: params.serialNo,
        name: params.name,
        parentSerialNo: params.parentSerialNo,
        parentMachine: params.parentMachine,
        status: params.status,
        supplier: params.supplier,
        machineModel: params.machineModel,
        workOrderRef: params.workOrderRef,
        customer: params.customer,
        billingSite: params.billingSite,
        instalationSite: params.instalationSite,
        accountManager: params.accountManager,
        projectManager: params.projectManager,
        supportManager: params.supportManager,
        description: params.description,
        customerTags: params.customerTags,
      };
     /* eslint-enable */

      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${params.id}`,
        data
      );

      dispatch(getMachine(params.id));
      dispatch(slice.actions.setMachineEditFormVisibility(false));

      // this.updateCustomerSuccess(response);

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };

}