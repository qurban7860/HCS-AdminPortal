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
  departments: [],
  department: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'department',
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

    // RESET Department
    resetDepartment(state){
      state.department = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Departments
    resetDepartments(state){
      state.departments = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // GET Contact
    getDepartmentSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.department = action.payload;
      state.initial = true;
    },

    // GET Contacts
    getDepartmentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.departments = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
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
  resetDepartment,
  resetDepartments,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function addDepartment(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        departmentName: params.departmentName,
        isActive: params.isActive,
      };

      /* eslint-enable */

      await axios.post(`${CONFIG.SERVER_URL}crm/departments`,
        data,
      );

      dispatch(slice.actions.setResponseMessage('Department saved successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateDepartment(params, Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    try {
      /* eslint-disable */
      let data = {
        departmentName: params.departmentName,
        isActive: params.isActive,
      };

      /* eslint-enable */

      await axios.patch(`${CONFIG.SERVER_URL}crm/departments/${Id}`,
        data
      );
      dispatch(slice.actions.setResponseMessage('Department updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------

export function getDepartments( ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
       const response = await axios.get(`${CONFIG.SERVER_URL}crm/departments` , 
        {
          params: {
            isArchived: false,
            orderBy : {
              createdAt:-1
            }
          }
        }
        );
      dispatch(slice.actions.getDepartmentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Departments loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------

export function getActiveDepartments( ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
       const response = await axios.get(`${CONFIG.SERVER_URL}crm/departments` , 
        {
          params: {
            isArchived: false,
            isActive: true,
          }
        }
        );
      dispatch(slice.actions.getDepartmentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Departments loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getDepartment(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      dispatch(resetDepartment())
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/departments/${id}`);
      dispatch(slice.actions.getDepartmentSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteDepartment(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        isArchived: true,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/departments/${id}`,
        data
      );
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
