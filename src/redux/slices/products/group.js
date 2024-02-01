import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  group: {},
  groups: [],
  activeGroups: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    
    startLoading(state) {
      state.isLoading = true;
    },
  
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },
    
    getGroupsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.groups = action.payload;
      state.initial = true;
    },
    
    getActiveGroupsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeGroups = action.payload;
      state.initial = true;
    },
    
    getGroupSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.group = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    resetGroup(state){
      state.group = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    resetGroups(state){
      state.groups = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    resetActiveGroups(state){
      state.activeGroups = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    
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
  resetGroup,
  resetGroups,
  resetActiveGroups,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function getGroups(){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/groups`, 
      {
        params: {
          isArchived: false
        }
      });
      dispatch(slice.actions.getGroupsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Groups loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getActiveGroups(){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/groups`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      });
      dispatch(slice.actions.getActiveGroupsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Active Groups loaded successfully'));
      // dispatch(slice.actions)
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getGroup(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/groups/${id}`);
      dispatch(slice.actions.getGroupSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//------------------------------------------------------------------------------

export function deleteGroup(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/groups/${id}`,
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

export function addGroup(data) {
    return async (dispatch) => {
      dispatch(slice.actions.resetGroup());
      dispatch(slice.actions.startLoading());
      try {
        const response = await axios.post(`${CONFIG.SERVER_URL}products/groups`, data);
        dispatch(slice.actions.setResponseMessage(response.data));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };
}

// --------------------------------------------------------------------------

export function updateGroup(data,Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/groups/${Id}`, data);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}