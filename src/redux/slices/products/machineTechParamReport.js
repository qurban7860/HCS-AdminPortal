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
  techparamReport: [],
  machineSettingReportstotalCount: 0,
  error: null,
  page: 0,
  rowsPerPage: 100,
  reportHiddenColumns: {
    "serialNo": false,
    "machineModel.name": false,
    "customer.name": false,
    "HLCSoftwareVersion": false,
    "PLCSoftwareVersion": false,
},
};

const slice = createSlice({
  name: 'techparamReport',
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
     // Set PageRowCount
     ChangeRowsPerPage(state, action) {
        state.rowsPerPage = action.payload;
      },
      // Set PageNo
      ChangePage(state, action) {
        state.page = action.payload;
      },
      
      setReportHiddenColumns(state, action){
        state.reportHiddenColumns = action.payload;  
      },

     // GET 
     getTechparamReportsSuccess(state, action) {
        state.isLoading = false;
        state.success = true;
        state.techparamReport = action.payload;
        state.machineSettingReportstotalCount = action?.payload?.totalCount;
        state.initial = true;
      },
      // RESET
      resetTechparamReports(state){
        state.techparamReport = [];
        state.responseMessage = null;
        state.success = false;
        state.machineSettingReportstotalCount = 0;
        // state.isLoading = false;
      },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setResponseMessage,
  resetTechparamReports,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns
} = slice.actions;


// -----------------------------------Get Machine Report-----------------------------------  

export function getTechparamReports({ page, pageSize, searchKey = null, searchColumn = null, machineStatus = null }) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.get(`${CONFIG.SERVER_URL}products/techparamReport`, {
          params: {
            pagination: { page, pageSize },
            ...(searchKey?.length > 0 && { search: {key: searchKey, column: searchColumn} }),
            machineStatus,
          }
        });
        dispatch(slice.actions.getTechparamReportsSuccess(response.data));
        dispatch(slice.actions.setResponseMessage('Techparams loaded successfully'));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.message || 'An error occurred'));
        throw error;
      }
    };
  }
