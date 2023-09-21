import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  checkItemEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  checkItem: {},
  checkItems: [],
  activeCheckItems: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  inputTypes: [
    { _id:1 , name: 'Number'},
    { _id:2 , name: 'String'},
    { _id:3 , name: 'Date'},
    { _id:4 , name: 'Boolean'},
  ],
  unitTypes: [
    { _id:1 , name: 'Milimeter'},
    { _id:2 , name: 'Meter'},
    { _id:3 , name: 'Inches'},
    { _id:4 , name: 'Feet'},
  ],
};

const slice = createSlice({
  name: 'checkItems',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setCheckItemEditFormVisibility(state, action){
      state.techparamEditFormFlag = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET MACHINE SERVICE PARAM
    getCheckItemsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.checkItems = action.payload;
      state.initial = true;
    },
    // GET MACHINE SERVICE PARAM
    getCheckItemSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.checkItem = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getActiveCheckItemsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeCheckItems = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET MACHINE TECH PARAM
    resetCheckItem(state){
      state.checkItem = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM
    resetCheckItems(state){
      state.checkItems = [];
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
  setCheckItemEditFormVisibility,
  getActiveCheckItemsSuccess,
  resetCheckItems,
  resetCheckItem,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------
export function getActiveCheckItems (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/checkItems`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      }
      );
      dispatch(slice.actions.getActiveCheckItemsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Active Check Items loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------

export function getCheckItems (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/checkItems`, 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getCheckItemsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Techparams loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}


// ----------------------------------------------------------------------
export function getCheckItem(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/checkItems/${id}`);
      dispatch(slice.actions.getCheckItemSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteCheckItem(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/checkItems/${id}` , 
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

export function addCheckItem(params) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        
        /* eslint-disable */
        let data = {
          name:             params?.name,
          category:         params?.serviceCategory?._id,
          printName:        params?.printName,
          helpHint:         params?.helpHint,
          linkToUserManual: params?.linkToUserManual,
          inputType:        params?.inputType?.name,
          unitType:         params?.unitType?.name,    
          minValidation:    params?.minValidation,
          maxValidation:    params?.maxValidation,
          description:      params?.description,
          isRequired:       params?.isRequired, 
          isActive:         params?.isActive,
        };
        const response = await axios.post(`${CONFIG.SERVER_URL}products/checkItems`, data);
        dispatch(slice.actions.getCheckItemSuccess(response.data.MachineTool));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateCheckItem(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        name:             params?.name,
        category:         params?.serviceCategory?._id || null,
        printName:        params?.printName,
        helpHint:         params?.helpHint,
        linkToUserManual: params?.linkToUserManual,
        inputType:        params?.inputType?.name || '',
        unitType:         params?.unitType?.name || '',    
        minValidation:    params?.minValidation,
        maxValidation:    params?.maxValidation,
        description:      params?.description,
        isRequired:       params?.isRequired, 
        isActive:         params?.isActive,
      };
     /* eslint-enable */
      await axios.patch(`${CONFIG.SERVER_URL}products/checkItems/${id}`,data);
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}