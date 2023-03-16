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
      console.log('toggle', action.payload);
      state.machineEditFormFlag = action.payload;
    },
    
    // RESET CUSTOMER
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

    // GET Customers
    getMachinesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machines = action.payload;
      state.initial = true;
    },

    // GET Customer
    getMachineSuccess(state, action) {
      
      state.isLoading = false;
      state.success = true;
      state.machine = action.payload;
      state.initial = true;
      console.log('machinesuccessslice', state.machine);
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
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines`);
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
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/machines/${id}`);
      dispatch(slice.actions.getMachineSuccess(response.data));
      console.log('requested machine', response.data);
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
      console.log(id);
      const response = await axios.delete(`${CONFIG.SERVER_URL}products/machines/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
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
      console.log('params from data', params);
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
        if(params.pserialNo){
          data.parentSerialNo = params.pserialNo;        
        }
        if(params.status){
          data.status = params.status;        
        }
        if(params.supplier){
          data.supplier = params.supplier;        
        }
        if(params.model){
            data.model = params.model;        
        }
        if(params.workOrder){
          data.workOrder = params.workOrder;        
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
        // if(params.operators){
        //     data.operators = params.operators;        
        // }
        if(params.accountManager){
          data.accountManager = params.accountManager;        
        }
        if(params.projectManager){
            data.projectManager = params.projectManager;        
        }
        if(params.supportManager){
            data.supportManager = params.supportManager;        
        }
        if(params.desc){
          data.description = params.desc;        
        }
        if(params.customerTags){
          data.customerTags = params.customerTags;        
        }
console.log("Data for the subbmission:",data)
        const response = await axios.post(`${CONFIG.SERVER_URL}products/machines`, data);

        console.log('response', response.data.Machine);
        dispatch(slice.actions.getMachineSuccess(response.data.Machine));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error));
      }
    };

}

// --------------------------------------------------------------------------

// export function updateMachine(params) {
//   console.log('update, working')
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {

//       const formData = new FormData();
//       /* eslint-disable */
//       let data = {
//         id: params.id,
//         name: params.name,
//         tradingName: params.tradingName
//       };
//      /* eslint-enable */

//       if(params.mainSite){
//         data.mainSite = params.mainSite;
//       }
//       if(params.accountManager){
//         data.accountManager = params.accountManager;
//       }
//       if(params.projectManager){
//         data.projectManager = params.projectManager;
//       }
//       if(params.supportManager){
//         data.supportManager = params.supportManager;
//       }
//       if(params.primaryBillingContact){
//         data.primaryBillingContact = params.primaryBillingContact;        
//       }
//       if(params.primaryTechnicalContact){
//         data.primaryTechnicalContact = params.primaryTechnicalContact;        
//       }
      
//       const response = await axios.patch(`${CONFIG.SERVER_URL}Machines/customers/${params.id}`,
//         data
//       );

//       dispatch(getMachine(params.id));
//       dispatch(slice.actions.setMachineEditFormVisibility(false));

//       // this.updateCustomerSuccess(response);

//     } catch (error) {
//       console.error(error);
//       dispatch(slice.actions.hasError(error));
//     }
//   };

// }