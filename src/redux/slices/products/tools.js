import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  toolEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  tools: [],
  activeTools: [],
  tool: {},
  toolParams: {},
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'tool',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setToolEditFormVisibility(state, action){
      state.toolEditFormFlag = action.payload;
    },
    
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  TOOLS
    getToolsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.tools = action.payload;
      state.initial = true;
    },

    // GET ACTIVE TOOLS
    getActiveToolsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeTools = action.payload;
      state.initial = true;
    },

    // GET TOOLS
    getToolSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.tool = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET TOOLS
    resetTool(state){
      state.tool = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET TOOLS
    resetTools(state){
      state.tools = [];
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
  setToolEditFormVisibility,
  resetTool,
  resetTools,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getTools (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/tools`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getToolsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('tools loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveTools (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/tools`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      dispatch(slice.actions.getActiveToolsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('tools loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}
// ----------------------------------------------------------------------
 
export function getTool(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/tools/${id}`);
      dispatch(slice.actions.getToolSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteTool(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/tools/${id}` , 
      {
          isArchived: true, 
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function addTool(params) {
    return async (dispatch) => {
      dispatch(slice.actions.resetTool());
      dispatch(slice.actions.startLoading());
      try {
        /* eslint-disable */
        let data = {
          name: params.name,
          isActive: params?.isActive,
          description: params.description
        };
        /* eslint-enable */
        const response = await axios.post(`${CONFIG.SERVER_URL}products/tools`, data);
        dispatch(slice.actions.getToolsSuccess(response.data.Tool));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };
}

// --------------------------------------------------------------------------

export function updateTool(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      /* eslint-disable */
      let data = {
        id: params.id,
        name: params.name,
        isActive: params.isActive,
        description: params.description,
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}products/tools/${params.id}`,
        data
      );
      dispatch(getTool(params.id));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}