import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  techparamEditFormFlag: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  techparam: {},
  techparams: [],
  activeTechParams: [],
  techparamsByCategory: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'techparam',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // SET TOGGLE
    setTechparamEditFormVisibility(state, action){
      state.techparamEditFormFlag = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET MACHINE TECH PARAM
    getTechparamsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.techparams = action.payload;
      state.initial = true;
    },
    getTechparamsByCategorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.techparamsByCategory = action.payload;
      state.initial = true;
    },

    // GET MACHINE TECH PARAM
    getTechparamSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.techparam = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active TECH PARAM
    getActiveTechparamsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeTechParams = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET MACHINE TECH PARAM
    resetTechParam(state){
      state.techparam = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM
    resetTechParams(state){
      state.techparams = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM CATEGORY
    resetTechParamByCategory(state){
      state.techparamsByCategory = [];
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
  setTechparamEditFormVisibility,
  getActiveTechparamsSuccess,
  resetTechParams,
  resetTechParam,
  resetTechParamByCategory,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------
export function getActiveTechparams (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/techparams`, 
      {
        params: {
          isArchived: false,
          isActive: true
        }
      }
      );
      dispatch(slice.actions.getActiveTechparamsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Techparams loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------

export function getTechparams (){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/techparams`, 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getTechparamsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Techparams loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getTechparamsByCategory (cateegoryId){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}products/techparams`, 
      {
        params: {
          category: cateegoryId,
          isArchived: false,
          isActive: true        
        }
      }
      );
      dispatch(slice.actions.getTechparamsByCategorySuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Techparams loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}
// ----------------------------------------------------------------------
export function getTechparam(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/techparams/${id}`);
      dispatch(slice.actions.getTechparamSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteTechparams(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/techparams/${id}` , 
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

export function addTechparam(params) {
    return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        
        /* eslint-disable */
        let data = {
          name: params.name,
          isActive: params.isActive,
          description: params.description,
          code: params.code
        };
        /* eslint-enable */
          if(params.category){
            data.category = params.category;
          }else{
            data.category = null
          }
        const response = await axios.post(`${CONFIG.SERVER_URL}products/techparams`, data);
        dispatch(slice.actions.getTechparamsSuccess(response.data.Techparam));
      } catch (error) {
        console.error(error);
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
    };

}

// --------------------------------------------------------------------------

export function updateTechparam(params,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        name: params.name,
        isActive: params.isActive,
        description: params.description,
        code: params.code
      };
     /* eslint-enable */

      if(params.category){
        data.category = params.category;
      }else{
        data.category = null
      }
      await axios.patch(`${CONFIG.SERVER_URL}products/techparams/${id}`,
        data
      );
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}