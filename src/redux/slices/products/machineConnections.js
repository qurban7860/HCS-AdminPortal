import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  machineConnections:[],
  error: null,
};

const slice = createSlice({
  name: 'machineConnections',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
     // GET users
     getMachineConnectionsSuccess(state, action) {
        state.isLoading = false;
        state.success = true;
        state.machineConnections = action.payload;
        state.initial = true;
      },

        // RESET MACHINE
        resetMachineConnections(state){
          state.machineConnections = [];
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
  setResponseMessage,
  resetMachineConnections
} = slice.actions;


// -----------------------------------Get Machine Connections-----------------------------------  

export function getMachineConnections(customerId) {
  return async (dispatch) => {
    try {
    dispatch(slice.actions.startLoading());
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/getDecoilerProducts/`,
      {
        params: {
          customer: customerId
        }
      });
      if(regEx.test(response.status)){
        dispatch(slice.actions.getMachineConnectionsSuccess(response.data));
      }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
