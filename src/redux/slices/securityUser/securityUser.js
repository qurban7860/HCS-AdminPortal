import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  securityUserFormVisibility: false,
  securityUserEditFormVisibility: false,
  changePasswordByAdminDialog: false,
  changePasswordDialog: false,
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  isLoadingResetPasswordEmail: false,
  error: null,
  securityUsers: [],
  activeSecurityUsers: [],
  securityUser: null,
  securityUserDialog: false,
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
  reportHiddenColumns: {
    "name": false,
    "login": false,
    "phone": false,
    "requestURL": false,
    "roles.name.[]": false,
    "contact.firstName": false,
    "isActive": true,
    "createdAt": false,
  },
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
    },
    // START LOADING
    startLoadingResetPasswordEmail(state) {
      state.isLoadingResetPasswordEmail = true;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoadingResetPasswordEmail = false;
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

    // SET VISIBILITY
    setChangePasswordByAdminDialog(state, action){
      state.changePasswordByAdminDialog = action.payload;
    },

    
    // SET VISIBILITY
    setChangePasswordDialog(state, action){
      state.changePasswordDialog = action.payload;
    },

    

    // SET ACTIVE RESTRICTED LIST
    setActiveFilterList(state, action){
      state.activeFilterList = action.payload;
    },
    
    // SET EMPLOYEE RESTRICTED LIST
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
      state.securityUsers = action.payload;
    },

    // GET Active users
    getActiveSecurityUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeSecurityUsers = action.payload;
      state.initial = true;
    },

    // GET Active SP Technical users
    getActiveSPTechnicalSecurityUsersSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeSPTechnicalSecurityUsers = action.payload;
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
    resetLoadingResetPasswordEmail(state, action) {
      state.isLoadingResetPasswordEmail = false;
    },

    // SET RES MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },
    
    // SET RES MESSAGE
    setSecurityUserDialog(state, action) {
      state.securityUserDialog = action.payload;
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
    // set ColumnFilter
    setReportHiddenColumns(state, action){
      state.reportHiddenColumns = action.payload;  
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setSecurityUserFormVisibility,
  setSecurityUserEditFormVisibility,
  setChangePasswordByAdminDialog,
  setChangePasswordDialog,
  setSecurityUserProperties,
  resetSecurityUsers,
  resetSecurityUser,
  resetLoadingResetPasswordEmail,
  setFilterBy,
  setActiveFilterList,
  setEmployeeFilterList,
  setFilterRegion,
  setSecurityUserDialog,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns,
} = slice.actions;
// ----------------------------------------------------------------------

export function addSecurityUser(param, isInvite) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
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
        regions: param.regions?.map(region => region?._id ),
        customers: param.customers?.map(customer => customer?._id),
        machines: param.machines?.map(machines => machines?._id),
        isInvite: param.isInvite,
        isActive: param.isActive,
        currentEmployee: param.currentEmployee,
        multiFactorAuthentication: param.multiFactorAuthentication,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}security/users`, data);
      // if(regEx.test(response.status) && isInvite){
      //   await axios.get(`${CONFIG.SERVER_URL}security/invites/sendUserInvite/${response?.data?.user?._id}`);
      //   dispatch(setSecurityUserFormVisibility(false))
      //   dispatch(getSecurityUsers());
      // }
      dispatch(slice.actions.stopLoading());
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
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
        customer: param.customer,
        contact: param.contact?._id || null,
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
      dispatch(slice.actions.stopLoading());
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
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
          isActive: true,
          invitationStatus: false,
        }
      }

      Object.assign(query.params, type)
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users`,query);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getActiveSecurityUsersSuccess(response.data));
      }
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  }
}

export function getActiveSPTechnicalSecurityUsers(type) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 

      const query = {
        params: {
          isArchived: false,
          isActive: true,
          invitationStatus: false,
          customer: {
            type: "SP"
          },
          contact: {
            department: {departmentType: "Technical"}
          }
        }
      }
      const fields = {fields: "contact,customer,email,name"}
      Object.assign(query.params, type, fields)
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users`,query);
      if(regEx.test(response.status)){
        dispatch(slice.actions.getActiveSPTechnicalSecurityUsersSuccess(response.data));
      }
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getValidateUserEmail( login ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users/validate`, { params: { login, isArchived: false } } );
      return response;
    } catch (error) {
      await dispatch(slice.actions.stopLoading());
      throw error;
    }
  }
}

// ----------------------------------------------------------------------

export function getSecurityUsers( param ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{ 
      const params = {
        isArchived: param?.isArchived || false,
        invitationStatus: param?.invitationStatus || false
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}security/users`, { params });
      if(regEx.test(response.status)){
        dispatch(slice.actions.getSecurityUsersSuccess(response.data));
      }
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
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
      dispatch(slice.actions.hasError(error.Message));
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
      dispatch(slice.actions.hasError(error.Message));
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
        dispatch(slice.actions.hasError(error.Message));
        throw error;
      }
  };
}

export function archiveSecurityUser( id, params ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.patch(`${CONFIG.SERVER_URL}security/users/${id}`, { isArchived: params?.isArchived } );
      dispatch(slice.actions.getSecurityUserSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteSecurityUser(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.delete(`${CONFIG.SERVER_URL}security/users/${id}`, { isArchived: true, } );
      dispatch(slice.actions.getSecurityUserSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
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
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
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

export function sendResetPasswordEmail(email) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoadingResetPasswordEmail());
    try{
      const data = {
        email
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}security/forgetPassword`,data);
      dispatch(slice.actions.resetLoadingResetPasswordEmail());
      return response; 
    } catch (error) {
      dispatch(slice.actions.resetLoadingResetPasswordEmail());
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
      dispatch(slice.actions.hasError(error.Message));
      console.error(error);
      throw error;
      // dispatch(slice.actions.hasError(error.Message));
    }
  };
}
