// import sum from 'lodash/sum';
// import uniq from 'lodash/uniq';
// import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';


// ----------------------------------------------------------------------
const initialState = {
  formVisibility: false,
  toolInstalledEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  toolsInstalled: [],
  toolInstalled: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  toolTypes: [
    { _id:1 , name: 'GENERIC TOOL'},
    { _id:2 , name: 'SINGLE TOOL'},
    { _id:3 , name: 'COMPOSIT TOOL'},
  ],
  toolTypesObj: [
    { _id:1 , name: 'GENERIC TOOL'},
    { _id:2 , name: 'SINGLE TOOL'},
    { _id:3 , name: 'COMPOSIT TOOL'},
  ],
  movingPunchConditions: [
    { _id: 1 , name: 'NO PUNCH'},
    { _id: 2 , name: 'PUNCH WHILE JOGGING'},
    { _id: 3 , name: 'PUNCH WHILE RUNNING'}
  ],
  engageOnConditions: [
    { _id: 1 , name: 'PASS'},
    { _id: 2 , name: 'NO CONDITION'},
    { _id: 3 , name: 'PROXIMITY SENSOR'}
  ],
  engageOffConditions: [
    { _id: 1, name: 'PASS'},
    { _id: 2, name: 'TIMER'},
    { _id: 3, name: 'PROXIMITY SENSOR'},
    { _id: 4, name: 'PRESSURE TARGET'},
    { _id: 5, name: 'DISTANCE SENSOR'},
    { _id: 6, name: 'PRESSURE TRIGGERS TIMER'}
  ],
};

const slice = createSlice({
  name: 'ToolInstalled',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;

    },
    // SET TOGGLE
    setToolInstalledFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setToolInstalledEditFormVisibility(state, action){
      state.toolInstalledEditFormVisibility = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET TOOLS INSTALLED
    getToolsInstalledSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.toolsInstalled = action.payload;
      state.initial = true;
    },

    // GET TOOLS INSTALLED
    getToolInstalledSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.toolInstalled = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET TOOLS INSTALLED
    resetToolInstalled(state){
      state.toolInstalled = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET TOOLS INSTALLED
    resetToolsInstalled(state){
      state.toolsInstalled = [];
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
  setToolInstalledFormVisibility,
  setToolInstalledEditFormVisibility,
  resetToolInstalled,
  resetToolsInstalled,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------Save TOOLS INSTALLED ------------------------------------------

export function addToolInstalled(machineId,params) {
    return async (dispatch) => {
        dispatch(slice.actions.startLoading());
        try {
          /* eslint-disable */
            let data = {
                tool: params.tool._id,
                offset: params.offset,
                isApplyWaste: params.isApplyWaste,
                wasteTriggerDistance: params.wasteTriggerDistance,
                isApplyCrimp: params.isApplyCrimp,
                crimpTriggerDistance: params.crimpTriggerDistance,
                isBackToBackPunch: params.isBackToBackPunch,
                isManualSelect: params.isManualSelect,
                isAssign: params.isAssign,
                operations: params.operations,
                // note: params.note,
                toolType: params.toolType.name,
                isActive: params.isActive,
                // singleToolConfig: {},
                // compositeToolConfig:{}
            }
          if( params.toolType.name === 'SINGLE TOOL' ){
            data.singleToolConfig = {}
            if(params.engageSolenoidLocation){
              data.singleToolConfig.engageSolenoidLocation = params.engageSolenoidLocation;
            }
            if(params.returnSolenoidLocation){
              data.singleToolConfig.returnSolenoidLocation = params.returnSolenoidLocation;
            }
            if(params.engageOnCondition){
              data.singleToolConfig.engageOnCondition = params.engageOnCondition.name;
            }
            if(params.engageOffCondition){
              data.singleToolConfig.engageOffCondition = params.engageOffCondition.name;
            }
            if(params.timeOut){
              data.singleToolConfig.timeOut = params.timeOut;
            }
            if(params.engagingDuration){
              data.singleToolConfig.engagingDuration = params.engagingDuration;
            }
            if(params.returningDuration){
              data.singleToolConfig.returningDuration = params.returningDuration;
            }
            if(params.twoWayCheckDelayTime){
              data.singleToolConfig.twoWayCheckDelayTime = params.twoWayCheckDelayTime;
            }
            if(params.homeProximitySensorLocation){
              data.singleToolConfig.homeProximitySensorLocation = params.homeProximitySensorLocation;
            }
            if(params.engagedProximitySensorLocation){
              data.singleToolConfig.engagedProximitySensorLocation = params.engagedProximitySensorLocation;
            }
            if(params.pressureTarget){
              data.singleToolConfig.pressureTarget = params.pressureTarget;
            }
            if(params.distanceSensorLocation){
              data.singleToolConfig.distanceSensorLocation = params.distanceSensorLocation;
            }
            if(params.distanceSensorTarget){
              data.singleToolConfig.distanceSensorTarget = params.distanceSensorTarget;
            }
            if(params.isHasTwoWayCheck){
              data.singleToolConfig.isHasTwoWayCheck = params.isHasTwoWayCheck;
            }
            if(params.isEngagingHasEnable){
              data.singleToolConfig.isEngagingHasEnable = params.isEngagingHasEnable;
            }
            if(params.isReturningHasEnable){
              data.singleToolConfig.isReturningHasEnable = params.isReturningHasEnable;
            }
            if(params.movingPunchCondition){
              data.singleToolConfig.movingPunchCondition = params.movingPunchCondition.name;
            }
          }else if ( params.toolType.name === 'COMPOSIT TOOL' ){
                data.compositeToolConfig = params.compositeToolConfig.filter(config =>  config?.engage?.tool?._id || config?.disengage?.tool?._id ).map(config => ({ engageInstruction: config?.engage?._id ,  disengageInstruction: config?.disengage?._id }))
                // params.compositeToolConfig.filter(config =>  config?.engage?._id && config?.disengage?._id )
            // if(params.engageInstruction){
            //   data.compositeToolConfig.engageInstruction = params.engageInstruction.map(obj => obj._id);
            // }
            // if(params.disengageInstruction){
            //   data.compositeToolConfig.disengageInstruction = params.disengageInstruction.map(obj => obj._id);
            // }
          }
          // console.log("data : ", data);
          /* eslint-enable */ 
        await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled/`, data);
        dispatch(slice.actions.setResponseMessage('Tool Installed successfully'));
      } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update TOOLS INSTALLED -------------------------------------

export function updateToolInstalled(machineId,toolInstallledId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
          tool: params.tool._id,
          offset: params.offset,
          isApplyWaste: params.isApplyWaste,
          wasteTriggerDistance: params.wasteTriggerDistance,
          isApplyCrimp: params.isApplyCrimp,
          crimpTriggerDistance: params.crimpTriggerDistance,
          isBackToBackPunch: params.isBackToBackPunch,
          isManualSelect: params.isManualSelect,
          isAssign: params.isAssign,
          operations: params.operations,
          // note: params.note,
          toolType: params.toolType.name,
          isActive: params.isActive,
          // singleToolConfig: {},
          // compositeToolConfig:{}
      }
    if( params.toolType.name === 'SINGLE TOOL' ){
      data.singleToolConfig = {}
      if(params.engageSolenoidLocation){
        data.singleToolConfig.engageSolenoidLocation = params.engageSolenoidLocation;
      }
      if(params.returnSolenoidLocation){
        data.singleToolConfig.returnSolenoidLocation = params.returnSolenoidLocation;
      }
      if(params.engageOnCondition){
        data.singleToolConfig.engageOnCondition = params.engageOnCondition.name;
      }
      if(params.engageOffCondition){
        data.singleToolConfig.engageOffCondition = params.engageOffCondition.name;
      }
      if(params.timeOut){
        data.singleToolConfig.timeOut = params.timeOut;
      }
      if(params.engagingDuration){
        data.singleToolConfig.engagingDuration = params.engagingDuration;
      }
      if(params.returningDuration){
        data.singleToolConfig.returningDuration = params.returningDuration;
      }
      if(params.twoWayCheckDelayTime){
        data.singleToolConfig.twoWayCheckDelayTime = params.twoWayCheckDelayTime;
      }
      if(params.homeProximitySensorLocation){
        data.singleToolConfig.homeProximitySensorLocation = params.homeProximitySensorLocation;
      }
      if(params.engagedProximitySensorLocation){
        data.singleToolConfig.engagedProximitySensorLocation = params.engagedProximitySensorLocation;
      }
      if(params.pressureTarget){
        data.singleToolConfig.pressureTarget = params.pressureTarget;
      }
      if(params.distanceSensorLocation){
        data.singleToolConfig.distanceSensorLocation = params.distanceSensorLocation;
      }
      if(params.distanceSensorTarget){
        data.singleToolConfig.distanceSensorTarget = params.distanceSensorTarget;
      }
      if(params.isHasTwoWayCheck){
        data.singleToolConfig.isHasTwoWayCheck = params.isHasTwoWayCheck;
      }
      if(params.isEngagingHasEnable){
        data.singleToolConfig.isEngagingHasEnable = params.isEngagingHasEnable;
      }
      if(params.isReturningHasEnable){
        data.singleToolConfig.isReturningHasEnable = params.isReturningHasEnable;
      }
      if(params.movingPunchCondition){
        data.singleToolConfig.movingPunchCondition = params.movingPunchCondition.name;
      }
    }else if ( params.toolType.name === 'COMPOSIT TOOL' ){
      data.compositeToolConfig = params.compositeToolConfig.filter(config =>  config?.engage?.tool?._id || config?.disengage?.tool?._id ).map(config => ({ engageInstruction: config?.engage?._id ,  disengageInstruction: config?.disengage?._id }))

      // data.compositeToolConfig = {}
      // if(params.engageInstruction){
      //   data.compositeToolConfig.engageInstruction = params.engageInstruction.map(obj => obj._id);
      // }
      // if(params.disengageInstruction){
      //   data.compositeToolConfig.disengageInstruction = params.disengageInstruction.map(obj => obj._id);
      // }
    }
      await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled/${toolInstallledId}`, data, );
      dispatch(slice.actions.setResponseMessage('Tool Installed updated successfully'));
      dispatch(setToolInstalledEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get TOOLS INSTALLED -----------------------------------

export function getToolsInstalled(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getToolsInstalledSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Installed Tools loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -------------------------------get TOOLS INSTALLED ---------------------------------------

export function getToolInstalled(machineId,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled/${Id}`);
      dispatch(slice.actions.getToolInstalledSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Installed Tool Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------archive TOOLS INSTALLED -------------------------------------

export function deleteToolInstalled(machineId,obj) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/toolsinstalled/${obj._id}` , 
      {
          isArchived: true, 
          toolType: obj.toolType,
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


