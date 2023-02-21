import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

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
      const response = await axios.get(`${CONFIG.SERVER_URL}machines/machines`);
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
      const response = await axios.get(`${CONFIG.SERVER_URL}machines/machines/${id}`);
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
      const response = await axios.delete(`${CONFIG.SERVER_URL}machines/${id}`);
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
        //   tradingName: params.tradingName,
        //   site: {
        //     name: params.name,
        //     address: {},
        //   },
        //   technicalContact: {},
        //   billingContact: {},
        };
        /* eslint-enable */

        if(params.desc){
          data.desc = params.desc;        
        }
        if(params.serialNo){
          data.serialNo = params.serialNo;        
        }
        if(params.parentMachine){
          data.parentMachine = params.parentMachine;        
        }
        if(params. pseriolNo){
          data. pseriolNo = params. pseriolNo;        
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
        if(params.instalationSite){
            data.instalationSite = params.instalationSite;        
        }
        if(params.billingSite){
          data.billingSite = params.billingSite;        
        }
        if(params.operators){
            data.operators = params.operators;        
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
          if(params.license){
            data.license = params.license;        
          }
          if(params.instalationSite){
              data.instalationSite = params.instalationSite;        
          }
          if(params.image){
            data.image = params.image;        
          }
          if(params.tools){
            data.tools = params.tools;        
          }
          if(params.itags){
            data.itags = params.itags;        
          }
          if(params.ctags){
            data.ctags = params.ctags;        
          }









        
        

        // if(params.firstName){
        //   data.billingContact.firstName = params.firstName;
        //   data.technicalContact.firstName = params.firstName;
        // }

        // if(params.lastName){
        //   data.billingContact.lastName = params.lastName;
        //   data.technicalContact.lastName = params.lastName;        

        // }

        // if(params.title){
        //   data.billingContact.title = params.title;
        //   data.technicalContact.title = params.title;

        // }

        // if(params.contactPhone){
        //   data.billingContact.title = params.title;
        //   data.technicalContact.title = params.title;        

        // }

        // if(params.contactEmail){
        //   data.billingContact.contactEmail = params.contactEmail;
        //   data.technicalContact.contactEmail = params.contactEmail;        

        // }

        const response = await axios.post(`${CONFIG.SERVER_URL}machines/machines`, data);

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