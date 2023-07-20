import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  intial: false,
  machineEditFormFlag: false,
  transferMachineFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  machine: {},
  machines: [],
  connectedMachine: {},
  activeMachines: [],
  customerMachines:[],
  machineLatLongCoordinates: [],
  transferDialogBoxVisibility: false
};

const slice = createSlice({
  name: 'machine',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },

    // SET DIALOGBOX VISIBILITY
    setTransferDialogBoxVisibility(state, action) {
      state.transferDialogBoxVisibility = action.payload;
    },

    // SET TOGGLE648ac5b7418fc12b70794fe4
    setMachineEditFormVisibility(state, action){
      state.machineEditFormFlag = action.payload;
    },

    // SET TOGGLE
    setTransferMachineFlag(state, action){
      state.transferMachineFlag = action.payload;
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
    // GET Machines
    getActiveMachinesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeMachines = action.payload;
      state.initial = true;
    },

     // GET Connected Machine
     getConnectedMachineSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.connectedMachine = action.payload;
      state.initial = true;
    },

    // GET Customer Machines
    getCustomerMachinesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customerMachines = action.payload;
      state.initial = true;
    },


    // GET Machine LatLong Coordinates
    getMachineLatLongCoordinatesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineLatLongCoordinates = action.payload;
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

    // RESET MACHINE
    resetMachine(state){
      state.machine = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE
    resetMachines(state){
      state.machines = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Active MACHINE
    resetActiveMachines(state){
      state.activeMachines = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // Reset Customer Machines
    resetCustomerMachines(state){
      state.customerMachines = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setMachineEditFormVisibility,
  stopLoading,
  setTransferMachineFlag,
  resetCustomerMachines,
  resetMachine,
  resetMachines,
  resetActiveMachines,
  setResponseMessage,
  setTransferDialogBoxVisibility
} = slice.actions;

// ----------------------------------------------------------------------

export function getMachines() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines`, 
      {
        params: {
          isArchived: false,
          orderBy : {
            createdAt:-1
          }
        }
      });
      dispatch(slice.actions.getMachinesSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Machines loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ----------------------------get Active Machines------------------------------------------

export function getActiveMachines() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines`, 
      {
        params: {
          isActive: true,
          isArchived: false
        }
      });
      dispatch(slice.actions.getActiveMachinesSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Machines loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------get Connected Machines------------------------------------------

export function getConnntedMachine(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${id}`);
      dispatch(slice.actions.getConnectedMachineSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
};

// -------------------------Machine Verification---------------------------------------

export function setMachineVerification(Id, verificationValue) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${Id}`, 
      {
          isVerified: !verificationValue,
      });
      dispatch(slice.actions.getActiveMachinesSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Machines loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------get Active Model Machines------------------------------------------

export function getActiveModelMachines(modelId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines`, 
      {
        params: {
          isActive: true,
          isArchived: false,
          machineModel: modelId
        }
      });
      dispatch(slice.actions.getActiveMachinesSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Machines loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ----------------------------------------------------------------------

export function getCustomerMachines(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines`, 
      {
        params: {
          customer: customerId
        }
      });
      dispatch(slice.actions.getCustomerMachinesSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Machines loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
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
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ----------------------------get Active Model Machines------------------------------------------

export function getMachineLatLongData() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/machineCoordinates`);
      dispatch(slice.actions.getMachineLatLongCoordinatesSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Machines loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
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
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------------------------------------------------------
 
export function addMachine(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetMachine());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          isActive: params.isActive,
        };
        /* eslint-enable */
        if(params.name){
          data.name = params.name
        }
        if(params.siteMilestone){
          data.siteMilestone = params.siteMilestone
        }
        if(params.machineConnectionVal){
          data.machineConnections = params.machineConnectionVal.map(obj => obj._id);
        }
        if(params.alias){
          data.alias = params.alias;        
        }
        if(params.serialNo){
          data.serialNo = params.serialNo;        
        }
        if(params.parentSerialNo){
          data.parentMachine = params.parentSerialNo._id;        
        }
        if(params.parentSerialNo){
          data.parentSerialNo = params.parentSerialNo.serialNo;        
        }
        if(params.status){
          data.status = params.status._id;        
        }
        if(params.supplier){
          data.supplier = params.supplier._id;        
        }
        if(params.model){
            data.machineModel = params.model._id;        
        }
        if(params.workOrderRef){
          data.workOrderRef = params.workOrderRef;        
        }
        if(params.customer){
          data.customer = params.customer._id;        
        }
        if(params.billingSite){
          data.billingSite = params.billingSite._id;        
        }
        if(params.instalationSite){
          data.instalationSite = params.instalationSite._id; 
        }
        if(params.installationDate){
          data.installationDate = params.installationDate;
        } 
        if(params.shippingDate){
          data.shippingDate = params.shippingDate;
        }    
        if(params.accountManager){
          data.accountManager = params.accountManager._id;        
        }
        if(params.projectManager){
            data.projectManager = params.projectManager._id;        
        }
        if(params.supportManager){
            data.supportManager = params.supportManager._id;        
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
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateMachine(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {

      
        serialNo: params.serialNo,
        name: params.name,
        status: params.status,
        supplier: params.supplier,
        machineModel: params.machineModel,
        workOrderRef: params.workOrderRef,
        customer: params.customer,
        billingSite: params.billingSite,
        instalationSite: params.instalationSite,
        installationDate: params.installationDate,
        shippingDate: params.shippingDate,
        siteMilestone: params.siteMilestone,
        accountManager: params.accountManager,
        projectManager: params.projectManager,
        supportManager: params.supportManager,
        description: params.description,
        machineConnections: params.machineConnections,
        customerTags: params.customerTags,
        isActive: params.isActive,
        // parentSerialNo: params.parentSerialNo,
        // parentMachine: params.parentMachine,
      };
      if(params?.alias){
        data.alias =  params.alias
      }
     /* eslint-enable */
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${params.id}`,
        data
      );

      dispatch(getMachine(params.id));
      dispatch(slice.actions.setMachineEditFormVisibility(false));
      // this.updateCustomerSuccess(response);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}

// --------------------------------------------------------------------------

export function transferMachine(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        machine: params._id,
        name: params.name,
        supplier: params.supplier,
        workOrderRef: params.workOrderRef,
        siteMilestone: params.siteMilestone,
        accountManager: params.accountManager,
        projectManager: params.projectManager,
        supportManager: params.supportManager,
        description: params.description,
        customerTags: params.customerTags,
      };
     /* eslint-enable */
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/transferMachine`,
        data
      );
      dispatch(setTransferDialogBoxVisibility(false));
      dispatch(getMachine(response.data.Machine.parentMachineID));
      return response; // eslint-disable-line

    } catch (error) {
      dispatch(slice.actions.stopLoading());
      console.error(error);
      throw error;
      // dispatch(slice.actions.hasError(error.Message));
    }
  };

}