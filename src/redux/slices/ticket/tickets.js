import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  ticket: null,
  tickets: [],
  ticketSettings:[],
  softwareVersion: null,
  filterBy: '',
  filterIssueType: null,
  filterRequestType: null,
  filterStatus: [],
  filterPriority: null,
  filterStatusType: null,
  filterResolvedStatus: null,
  filterAssignee: null,
  filterFault: null,
  page: 0,
  rowsPerPage: 100,
  initial: false,
  error: null,
  isLoading: false,
  isLoadingTicketFile: false,
  isLoadingSoftwareVersion: false,
  reportHiddenColumns: {
    "issueType.name": false,
    "ticketNo": false,
    "summary": false,
    "machine.serialNo": false,
    "machine.machineModel.name": false,
    "customer.name": false,
    "status.name": false,
    "priority.name": false,
    "createdAt": false,
    "reporter.name": true,
    "assignees.name.[]": false,
  },
};

const slice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // START LOADING File
    setLoadingFile( state, action ) {
      state.isLoadingTicketFile = action.payload;;
    },
    
    startLoadingSoftwareVersion(state) {
      state.isLoadingSoftwareVersion = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.isLoadingTicketFile = false;
      state.isLoadingSoftwareVersion = false;
      state.error = action.payload;
      state.initial = true;
      state.ticket = {};
      state.tickets = [];
    },
   
    // GET Tickets Success
    getTicketsSuccess(state, action) {
      state.isLoading = false;
      state.tickets = action.payload;
    },

    // GET Ticket Success
    getTicketSuccess(state, action) {
      state.isLoading = false;
      state.ticket = action.payload;
    },
    
    // GET Versions Success
    getSoftwareVersionSuccess(state, action) {
      state.isLoadingSoftwareVersion = false;
      state.softwareVersion = action.payload;
    },

    getTicketSettingsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.ticketSettings = action.payload;
      state.initial = true;
    },

    // POST Ticket Success
    postTicketSuccess(state, action) {
      state.isLoading = false;
      state.ticket = action.payload;
    },
    
    patchTicketSuccess(state, action) {
      state.isLoading = false;
      state.ticket = action.payload;
    },

    updateTicketFieldSuccess(state, action) {
      state.isLoading = false;
      const { name, value } = action.payload;
      state.ticket = {
        ...state.ticket,
       [name]: value
      }
    },

    deleteTicketSuccess(state, action) {
      state.isLoading = false;
      state.tickets = state.tickets.filter((ticket) => ticket._id !== action.payload);
    },

    getTicketFileSuccess(state, action) {
      const { id, data } = action.payload;
      const fArray = state.ticket.files;
      if (Array.isArray(fArray) && fArray.length > 0) {
        const fIndex = fArray.findIndex(f => f?._id === id);
        if ( fIndex !== -1) {
          const uFile = { ...fArray[fIndex], src: data };
          state.ticket = { ...state.ticket,
            files: [ ...fArray.slice(0, fIndex), uFile, ...fArray.slice(fIndex + 1) ],
          };
        }
      }
      state.isLoadingTicketFile = false;
    },
    

    addTicketFilesSuccess(state, action) {
      state.ticket = {
        ...state.ticket,
        files: [ ...( state.ticket?.files || [] ), ...( action.payload || [] ) ]
      }
      state.isLoadingTicketFile = false;
    },

    deleteTicketFileSuccess(state, action) {
      const { id } = action.payload;
      const array = state.ticket.files;
      if (Array.isArray(array) && array?.length > 0 ) {
        state.ticket = {
          ...state.ticket,
          files: state.ticket?.files?.filter( f => f?._id !== id ) || []
        };
      }
      state.isLoadingTicketFile = false;
    },

    // SET RESPONSE MESSAGE
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
    },

    // RESET Ticket
    resetTicket(state) {
      state.ticket = null;
      state.responseMessage = null;
      state.isLoading = false;
    },

    // RESET Tickets
    resetTickets(state) {
      state.tickets = [];
      state.responseMessage = null;
      state.isLoading = false;
    },
    
    // RESET 
    resetTicketSettings(state){
      state.ticketSettings = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    
    resetSoftwareVersion(state) {
      state.softwareVersion = null;
      state.responseMessage = null;
      state.isLoadingSoftwareVersion = false;
    },

    // SET FILTER BY
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    
    setFilterIssueType(state, action) {
      state.filterIssueType = action.payload;
    },

    setFilterRequestType(state, action) {
      state.filterRequestType = action.payload;
    },

    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
    },
    
    setFilterPriority(state, action) {
      state.filterPriority = action.payload;
    },

    setFilterStatusType(state, action) {
      state.filterStatusType = action.payload;
    },

    setFilterResolvedStatus(state, action) {
      state.filterResolvedStatus = action.payload;
    },

    setFilterAssignee(state, action) {
      state.filterAssignee = action.payload;
    },

    setFilterFault(state, action) {
      state.filterFault = action.payload;
    },

    // SET PAGE ROW COUNT
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },

    // SET PAGE NUMBER
    ChangePage(state, action) {
      state.page = action.payload;
    },

    setReportHiddenColumns(state, action) {
      state.reportHiddenColumns = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetTicket,
  resetTickets,
  resetTicketSettings,
  resetSoftwareVersion,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns,
  setFilterIssueType,
  setFilterRequestType,
  setFilterStatus,
  setFilterPriority,
  setFilterStatusType,
  setFilterAssignee,
  setFilterResolvedStatus,
  setFilterFault
} = slice.actions;

// ----------------------------------------------------------------------

// POST Ticket
export function postTicket(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();

      formData.append('customer', params?.customer?._id );
      formData.append('machine', params?.machine?._id );
      formData.append('issueType', params?.issueType?._id );
      params.faults.forEach(fault => formData.append('faults[]', fault._id));      
      formData.append('requestType', params?.requestType?._id );
      formData.append('summary', params?.summary || '');
      formData.append('description', params?.description || '');
      formData.append('changeType', params?.changeType?._id || null);
      formData.append('impact', params?.impact?._id || null);
      formData.append('priority', params?.priority?._id || null);
      formData.append('status', params?.status?._id || null);
      formData.append('changeReason', params?.changeReason?._id || null);
      formData.append('investigationReason', params?.investigationReason?._id || null);
      formData.append('implementationPlan', params?.implementationPlan || '');
      formData.append('backoutPlan', params?.backoutPlan || '');
      formData.append('testPlan', params?.testPlan || '');
      formData.append('shareWith', params?.shareWith );
      formData.append('isActive', params?.isActive );
      formData.append('rootCause', params?.rootCause || '');
      formData.append('workaround', params?.workaround || '');
      formData.append('plannedStartDate', params?.plannedStartDate || '');
      formData.append('startTime', params?.startTime || '');
      formData.append('plannedEndDate', params?.plannedEndDate || '');
      formData.append('endTime', params?.endTime || '');
      formData.append('hlc', params?.hlc || '');
      formData.append('plc', params?.plc || '');

      (params?.files || []).forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/`, formData);

      dispatch(slice.actions.postTicketSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// PATCH Ticket
export function patchTicket(id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();

      formData.append('customer', params?.customer?._id );
      formData.append('machine', params?.machine?._id );
      formData.append('requestType', params?.requestType?._id );
      params.faults.forEach(fault => formData.append('faults[]', fault._id));   
      formData.append('summary', params?.summary || '');
      formData.append('description', params?.description || '');
      formData.append('changeType', params?.changeType?._id || null);
      formData.append('impact', params?.impact?._id || null);
      formData.append('priority', params?.priority?._id || null);
      formData.append('status', params?.status?._id || null);
      formData.append('changeReason', params?.changeReason?._id || null);
      formData.append('investigationReason', params?.investigationReason?._id || null);
      formData.append('implementationPlan', params?.implementationPlan || '');
      formData.append('backoutPlan', params?.backoutPlan || '');
      formData.append('testPlan', params?.testPlan || '');
      formData.append('shareWith', params?.shareWith );
      formData.append('isActive', params?.isActive );
      formData.append('rootCause', params?.rootCause || '');
      formData.append('workaround', params?.workaround || '');
      formData.append('plannedStartDate', params?.plannedStartDate || '');
      formData.append('startTime', params?.startTime || '');
      formData.append('plannedEndDate', params?.plannedEndDate || '');
      formData.append('endTime', params?.endTime || '');
      formData.append('hlc', params?.hlc || '');
      formData.append('plc', params?.plc || '');

      (params?.files || []).forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/${id}`, formData);

      dispatch(slice.actions.patchTicketSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function updateTicketField(id, name, value) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {}
      if(Array.isArray(value)) {
        data[name]= value?.map(item => item._id) || [];
      } else {
        data[name]= value?._id || value
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/${id}`, data);

      dispatch(slice.actions.updateTicketFieldSuccess({ name, value }));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Tickets
export function getTickets({ page, pageSize, issueType, requestType, isResolved, statusType, status, priority, createdAt, assignees, faults }) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const params = {
        orderBy: { createdAt: -1 },
        pagination: { page, pageSize },
        isArchived: false,
        createdAt,
        issueType,
        requestType,
        isResolved,
        statusType,
        status,
        priority,
        assignees,
        faults
      };
      if (isResolved === 'unresolved') {
        params.isResolved = false; 
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}tickets`, { params });
      dispatch(slice.actions.getTicketsSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Ticket
export function getTicket(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(resetTicket());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/${id}`);
      dispatch(slice.actions.getTicketSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

// GET Software Versions
export function getSoftwareVersion(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoadingSoftwareVersion());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${id}/techparamvalues/softwareVersion/`);
      dispatch(slice.actions.getSoftwareVersionSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getTicketSettings ( cancelToken ){
  return async (dispatch) =>{
    dispatch(slice.actions.startLoading());
    try{
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/settings`, 
      {
        params: {
          isArchived: false,
          isActive: true,
        },
        cancelToken: cancelToken?.token,
      });
      dispatch(slice.actions.getTicketSettingsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('statuses loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ARCHIVE Ticket
export function deleteTicket(id, isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived }; 
      const response = await axios.patch(`${CONFIG.SERVER_URL}tickets/${id}`, data);
      dispatch(slice.actions.deleteTicketSuccess(response.data));
      return response;
    } catch (error) {
      dispatch(slice.actions.hasError(error.message));
      console.error(error);
      throw error;
    }
  };
}

export function getFile( id, fileId ) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}tickets/${id}/files/${fileId}`);
      dispatch(slice.actions.getTicketFileSuccess({ id: fileId, data: response.data } ));
      return response;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function addFiles( id, params ) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      const formData = new FormData();
      (params?.files || []).forEach((file, index) => {
        formData.append(`images`, file);
      });
      const response = await axios.post(`${CONFIG.SERVER_URL}tickets/${id}/files/`, formData);
      dispatch(slice.actions.addTicketFilesSuccess( response.data ));
      return response;
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteFile( id, fileId ) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      await axios.delete(`${CONFIG.SERVER_URL}tickets/${id}/files/${fileId}`);
      dispatch(slice.actions.deleteTicketFileSuccess( { id: fileId } ));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
