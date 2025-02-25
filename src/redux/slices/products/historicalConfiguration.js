import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  isLoadingINI: false,
  isLoadingCompareINI: false,
  isLoadingCompareINIs: false,
  historicalConfiguration: {},
  compareHistoricalConfiguration: {},
  historicalConfigurations: [],
  compareHistoricalConfigurations: [],
  selectedINIs: [],
  isHistorical: false,
  isDetailPage: false,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  error: null,
};

const slice = createSlice({
  name: 'historicalConfiguration',
  initialState,
  reducers: {

    startLoading(state) {
      state.isLoading = true;
    },

    startLoadingINI(state) {
      state.isLoadingINI = true;
    },

    startLoadingCompareINI(state) {
      state.isLoadingCompareINI = true;
    },

    startLoadingCompareINIs(state) {
      state.isLoadingCompareINIs = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.isLoadingINI = false;
      state.isLoadingCompareINI = false;
      state.isLoadingCompareINIs = false;
      state.error = action.payload;
      state.initial = true;
    },

    getHistoricalConfigurationRecordSuccess(state, action) {
      state.isLoading = false;
      state.isLoadingINI = false;
      state.success = true;
      state.historicalConfiguration = action.payload;
      state.initial = true;
    },

    getHistoricalConfigurationRecordsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.historicalConfigurations = action.payload;
      state.initial = true;
    },

    getCompareHistoricalConfigurationRecordsSuccess(state, action) {
      state.isLoadingCompareINIs = false;
      state.compareHistoricalConfigurations = action.payload;
    },

    getCompareHistoricalConfigurationRecordSuccess(state, action) {
      state.isLoadingCompareINI = false;
      state.compareHistoricalConfiguration = action.payload;
    },

    setSelectedINIs(state, action) {
      state.selectedINIs = action.payload;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
    },

    resetHistoricalConfigurationRecord(state) {
      state.historicalConfiguration = null;
      state.success = false;
      state.isLoading = false;
    },

    resetHistoricalConfigurationRecords(state) {
      state.historicalConfigurations = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    resetCompareHistoricalConfigurationRecords(state) {
      state.compareHistoricalConfigurations = [];
    },

    resetCompareHistoricalConfigurationRecord(state) {
      state.compareHistoricalConfiguration = null;
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
  resetHistoricalConfigurationRecord,
  resetHistoricalConfigurationRecords,
  resetCompareHistoricalConfigurationRecord,
  resetCompareHistoricalConfigurationRecords,
  setSelectedINIs,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ------------------------------------------------------------------------------------------------

export function getHistoricalConfigurationRecords(machineId, isMachineArchived, compareINI) {
  return async (dispatch) => {
    if (compareINI) {
      dispatch(slice.actions.startLoadingCompareINIs());
    } else {
      dispatch(slice.actions.startLoading());
    }
    try {
      const params = {
        isArchived: false,
        machine: machineId,
        orderBy: {
          createdAt: -1
        }
      }
      if (isMachineArchived) {
        params.archivedByMachine = true;
        params.isArchived = true;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/ini`, { params });
      console.log("Records Called!  ", compareINI, response.data)

      if (compareINI) {
        dispatch(slice.actions.getCompareHistoricalConfigurationRecordsSuccess(response.data));
      } else {
        dispatch(slice.actions.getHistoricalConfigurationRecordsSuccess(response.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getHistoricalConfigurationRecord(machineId, id, isINI, isCompare) {
  return async (dispatch) => {
    if (isINI) {
      dispatch(slice.actions.startLoadingINI());
    } else if (isCompare) {
      dispatch(slice.actions.startLoadingCompareINI());
    } else {
      dispatch(slice.actions.startLoading());
    }
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/ini/${id}`,
        {
          params: {
            machine: machineId,
          }
        });
      if (isCompare) {
        dispatch(slice.actions.getCompareHistoricalConfigurationRecordSuccess(response.data));
      } else {
        dispatch(slice.actions.getHistoricalConfigurationRecordSuccess(response.data));
      }

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function addHistoricalConfigurationRecord(machineId, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        configuration: params?.configuration,
        inputGUID: params?.inputGUID,
        inputSerialNo: params?.inputSerialNo,
        isManufacture: params?.isManufacture,
      }
      if (params?.backupDate) {
        data.backupDate = params.backupDate;
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/ini/`, data);
      dispatch(slice.actions.setResponseMessage(response?.data || ''));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
