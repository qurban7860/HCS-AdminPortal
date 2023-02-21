import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  departments: [],
  department: null,
  departmentParams: {
    name: 0
  }
};

const slice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET DEPARTMENTS
    getDepartmentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.departments = action.payload;
      state.initial = true;
    },

    // GET DEPARTMENT
    getDepartmentSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.department = action.payload;
      state.initial = true;
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
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function getDepartments() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}departments`);
      console.log(response);
      console.log(response.data);
      dispatch(slice.actions.getDepartmentsSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Departments Loaded Successfuly'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getDepartment(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}departments/${id}`);
      dispatch(slice.actions.getDepartmentSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Depratments Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteDepartment(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id);
      const response = await axios.delete(`${CONFIG.SERVER_URL}departments/${id}`);
      dispatch(slice.actions.setResponseMessage('Department Deleted Successfuly'));
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


// ----------------------------------------------------------------------


export function getAssetLocations() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    // try {

    // } catch (error) {
    //   console.error(error);
    //   dispatch(slice.actions.hasError(error));
    // }
  };
}

// ----------------------------------------------------------------------