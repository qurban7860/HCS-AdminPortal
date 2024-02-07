import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  securityUserFormVisibility: false,
  securityUserEditFormVisibility: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  securityUsers: [],
  activeSecurityUsers: [],
  securityUser: null,
  user: null,
  userId: null,
  userEmail: null,
  userLogin: null,
  userDisplayName: null,
  userRoles: [],
  assignedUsers: [],
  signInLogs: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  verifiedInvite:null,
  activeFilterList: 'active',
  employeeFilterList: 'all',
  filterRegion: null,
};

const slice = createSlice({
  name: 'user',
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

    // SET VISIBILITY
    setSecurityUserFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET VISIBILITY
    setSecurityUserEditFormVisibility(state, action){
      state.editFormVisibility = action.payload;
    },

    // SET ACTIVE FILTER LIST
    setActiveFilterList(state, action){
      state.activeFilterList = action.payload;
    },
    
    // SET EMPLOYEE FILTER LIST
    setFilterRegion(state, action){
      state.filterRegion = action.payload;
    },

    // SET USER PROPERTIES
    setSecurityUserProperties(state, userData){
      const { UserId, User } = userData;
      state.userId = UserId;
      state.userEmail = User.email;
      state.userLogin = User.login;
      state.userDisplayName = User.displayName;
      state.userRoles = User.roles;
    },

    // GET users
    getSecurityUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.securityUsers = action.payload;
      state.initial = true;
    },

    // GET Active users
    getActiveSecurityUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeSecurityUsers = action.payload;
      state.initial = true;
    },
    
    getLoggedInSecurityUserSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.loggedInUser = action.payload;
      state.initial = true;
    },


    // GET user
    getSecurityUserSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.securityUser = action.payload;
      state.initial = true;
    },

    // GET user
    getAssignedSecurityUserSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.assignedUsers = action.payload;
      state.initial = true;
    },

    // GET Active Sign in Logs
    getSignInLogsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.signInLogs = action.payload;
      state.initial = true;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET SECURITY USER
    resetSecurityUser(state){
      state.securityUser = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SECURITY USERS
    resetSecurityUsers(state){
      state.securityUsers = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET SIGNINLOGS
    resetSignInLogs(state){
      state.signInLogs = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // Get Verify Invite
    getVerifyInvite(state, action) {
      state.isLoading = false;
      state.success = true;
      state.verifiedInvite = action.payload;
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
  setSecurityUserFormVisibility,
  setSecurityUserEditFormVisibility,
  setSecurityUserProperties,
  resetSecurityUsers,
  resetSecurityUser,
  setFilterBy,
  setActiveFilterList,
  setEmployeeFilterList,
  setFilterRegion,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;
// ----------------------------------------------------------------------

export function addSecurityUser(param, isInvite) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(resetSecurityUser());
    try{
      const data = {
      customer: param.customer?._id,
      contact: param.contact?._id,
      name: param.name,
      phone:  param.phone,
      email: param.email,
      login: param.email,
      password: param.password,
      roles: param.roles.map(role => role?._id ),
      dataAccessibilityLevel: param?.dataAccessibilityLevel?.toUpperCase() ,
      regions: param.selectedRegions?.map(region => region?._id ),
      customers: param.customers?.map(customer => customer?._id),
      machines: param.machines?.map(machines => machines?._id),
      isInvite: param.isInvite,
      isActive: param.isActive,
      currentEmployee: param.currentEmployee,
      multiFactorAuthentication: param.multiFactorAuthentication,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}security/users`, data);
      if(regEx.test(response.status) && isInvite){
        await axios.get(`${CONFIG.SERVER_URL}security/invites/sendUserInvite/${response?.data?.user?._id}`);
        dispatch(setSecurityUserFormVisibility(false))
        dispatch(getSecurityUsers());
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function  updateSecurityUser(param,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const data = {
        // customer: param.customer,
        contact: param.contact?._id,
        name: param.name,
        phone:  param.phone,
        email: param.email,
        login: param.loginEmail,
        roles: param?.roles?.map( role => role?._id),
        dataAccessibilityLevel: param.dataAccessibilityLevel.toUpperCase(),
        regions: param.regions?.map( region => region?._id ),
        customers: param.customers?.map(customer => customer?._id ),
        machines: param.machines?.map( machine => machine?._id ),
        isActive: param.isActive,
        multiFactorAuthentication: param.multiFactorAuthentication,
        currentEmployee: param.currentEmployee,
        }
        if(param.password !== ""){
            data.password = param.password 
        }
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/${id}`, data);
      await dispatch(resetSecurityUser());
      await dispatch(getSecurityUser(id));
      // if(regEx.test(response.status)){
      //   dispatch(getSecurityUsers());
      // }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// -----------------------------Active Security Users-----------------------------------------

export function getActiveSecurityUsers(type) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 

      const query = {
        params: {
          isArchived: false,
          isActive: true
        }
      }

      
      Object.assign(query.params, type)
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users`,query);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getActiveSecurityUsersSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}


// ----------------------------------------------------------------------

export function getSecurityUsers() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users`,
      {
        params: {
          isArchived: false
        }
      }
      );
      if(regEx.test(response.status)){
        dispatch(slice.actions.getSecurityUsersSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getAssignedSecurityUsers(roleId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users`,
      {
        params: {
          isArchived: false,
          roles: roleId,
        }
      }
      );
        dispatch(slice.actions.getAssignedSecurityUserSuccess(response.data));
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
// ----------------------------------------------------------------------

export function getSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/${id}`);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getSecurityUserSuccess(response.data));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

// ---------------------------SET LoginUser Data -------------------------------------------

export function setLoginUser(userId,User) {
  return async (dispatch) => {
        dispatch(slice.actions.setSecurityUserProperties({userId, User}));
      }
}

// ----------------------------------------------------------------------

export function getLoggedInSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{  
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/${id}`);
        if(regEx.test(response.status)){
          dispatch(slice.actions.getLoggedInSecurityUserSuccess(response.data));
        }
        return response;
      } catch (error) {
        console.error(error);
        throw error;
      }
  };
}

// ----------------------------------------------------------------------

export function deleteSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/${id}`,
      {
        isArchived: true, 
      }
      );
      // state.responseMessage = response.data;
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
        dispatch(resetSecurityUser())
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
//------------------------------------------------------------------------------

export function SecurityUserPasswordUpdate(data, Id, isAdmin) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      if(isAdmin){
        data.isAdmin = true
      };

      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/updatePassword/${Id}`,
        data
      );
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
      }
      return response; // eslint-disable-line
    } catch (error) {
      console.error(error);
      throw error;
      // dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ----------------------------------------------------------------------

export function getSignInLogs(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/${id}/signinlogs/`);
      dispatch(slice.actions.getSignInLogsSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function sendUserInvite(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}security/invites/sendUserInvite/${Id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      return response; // eslint-disable-line
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  };
}

export function changeUserStatus(Id, status, lockUntil) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/changeUserStatus/${Id}/${status}/${lockUntil}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      return response; // eslint-disable-line
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  };
}

export function verifyUserInvite(Id,code) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}security/invites/verifyInviteCode/${Id}/${code}`);
      dispatch(slice.actions.getVerifyInvite(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
      throw error;
    }
  };
}

export function updateInvitedUser(data, Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/invites/updatePasswordUserInvite/${Id}`,
        data
      );
      if(regEx.test(response.status)){
        dispatch(slice.actions.setResponseMessage(response.data));
      }
      return response; // eslint-disable-line
    } catch (error) {
      console.error(error);
      throw error;
      // dispatch(slice.actions.hasError(error.Message));
    }
  };
}
