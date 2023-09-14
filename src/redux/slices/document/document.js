import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  documentFormVisibility: false,
  documentEditFormVisibility: false,
  documentViewFormVisibility: false,
  documentHistoryViewFormVisibility: false,
  documentNewVersionFormVisibility: false,
  documentAddFilesViewFormVisibility: false,
  documentHistoryNewVersionFormVisibility: false,
  documentHistoryAddFilesViewFormVisibility: false,
  documentEdit: false,
  documentIntial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  document: {},
  documents: [],
  activeDocuments: [],
  documentHistory: [],

  documentFilterBy: '',
  documentPage: 0,
  documentRowsPerPage: 100,

  machineDrawingsFilterBy: '',
  machineDrawingsPage: 0,
  machineDrawingsRowsPerPage: 100,

  customerDocumentsFilterBy: '',
  customerDocumentsPage: 0,
  customerDocumentsRowsPerPage: 100,

  machineDocumentsFilterBy: '',
  machineDocumentsPage: 0,
  machineDocumentsRowsPerPage: 100,
};

const slice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    // STOP LOADING
    stopLoading(state) {
      state.isLoading = false;
        },
    // SET TOGGLE
    setDocumentFormVisibility(state, action){
      state.documentFormVisibility = action.payload;
    },
    
    // SET TOGGLE
    setDocumentViewFormVisibility(state, action){
      state.documentViewFormVisibility = action.payload;
    },    
    
    // SET TOGGLE
    setDocumentEditFormVisibility(state, action){
      state.documentEditFormVisibility = action.payload;
    },
    // SET TOGGLE
    setDocumentHistoryViewFormVisibility(state, action){
      state.documentHistoryViewFormVisibility = action.payload;
    },
    // SET TOGGLE
    setDocumentNewVersionFormVisibility(state, action){
      state.documentNewVersionFormVisibility = action.payload;
    },
     // SET TOGGLE
    setDocumentAddFilesViewFormVisibility(state, action){
      state.documentAddFilesViewFormVisibility = action.payload;
    },
    // SET TOGGLE
    setDocumentHistoryNewVersionFormVisibility(state, action){
      state.documentHistoryNewVersionFormVisibility = action.payload;
    },
     // SET TOGGLE
    setDocumentHistoryAddFilesViewFormVisibility(state, action){
      state.documentHistoryAddFilesViewFormVisibility = action.payload;
    },
    setDocumentEdit(state, action){
      state.documentEdit = action.payload;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Documents
    getDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documents = action.payload;
      state.initial = true;
    },

    // GET ACTIVE Documents
    getActiveDocumentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeDocuments = action.payload;
      state.initial = true;
    },

    // GET Document
    getDocumentSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.document = action.payload;
      state.initial = true;
    },

    // GET Document
    getDocumentHistorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentHistory = action.payload;
      state.initial = true;
    },

    
    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET Document
    resetDocument(state){
      state.document = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Documents
    resetDocuments(state){
      state.documents = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // RESET Active Documents
    resetActiveDocuments(state){
      state.activeDocuments = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },
    // reset Document History
    resetDocumentHistory(state) {
      state.isLoading = false;
      state.success = false;
      state.documentHistory = [];
      state.responseMessage = null;
    },
    // Set PageNo
    ChangePage(state, action) {
      state.documentPage = action.payload;
    },
    // Set FilterBy
    setFilterBy(state, action) {
      state.documentFilterBy = action.payload;
    },
    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.documentRowsPerPage = action.payload;
    },
    // Set FilterBy
    setMachineDocumentFilterBy(state, action) {
      state.machineDocumentsFilterBy = action.payload;
    },
    // Set PageRowCount
    machineDocumentChangeRowsPerPage(state, action) {
      state.machineDocumentsRowsPerPage = action.payload;
    },
    // Set PageNo
    machineDocumentChangePage(state, action) {
      state.machineDocumentsPage = action.payload;
    },
    // Set FilterBy
    setCustomerDocumentFilterBy(state, action) {
      state.customerDocumentsFilterBy = action.payload;
    },
    // Set PageRowCount
    customerDocumentChangeRowsPerPage(state, action) {
      state.customerDocumentsRowsPerPage = action.payload;
    },
    // Set PageNo
    customerDocumentChangePage(state, action) {
      state.customerDocumentsPage = action.payload;
    },
    // Set FilterBy
    setMachineDrawingsFilterBy(state, action) {
      state.machineDrawingsFilterBy = action.payload;
    },
    // Set PageRowCount
    machineDrawingsChangeRowsPerPage(state, action) {
      state.machineDrawingsRowsPerPage = action.payload;
    },
    // Set PageNo
    machineDrawingsChangePage(state, action) {
      state.machineDrawingsPage = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setDocumentFormVisibility,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentHistoryNewVersionFormVisibility,
  setDocumentHistoryAddFilesViewFormVisibility,
  setDocumentEdit,
  resetDocument,
  resetDocuments,
  resetActiveDocuments,
  resetDocumentHistory,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setMachineDocumentFilterBy,
  machineDocumentChangePage,
  machineDocumentChangeRowsPerPage,
  setCustomerDocumentFilterBy,
  customerDocumentChangePage,
  customerDocumentChangeRowsPerPage,
  setMachineDrawingsFilterBy,
  machineDrawingsChangePage,
  machineDrawingsChangeRowsPerPage,
} = slice.actions;

// ----------------------------Add Document------------------------------------------

export function addDocument(customerId , machineId ,  params) {
    return async (dispatch) => { 
        dispatch(slice.actions.startLoading());
        try {
          const formData = new FormData();
          if(customerId){
            formData.append('customer', customerId);
          }
            if(machineId){
              formData.append('machine', machineId);
            }
            formData.append('customerAccess', params.customerAccess);
            formData.append('isActive', params.isActive);
          if(params.machineModel){
            formData.append('machineModel', params?.machineModel);
          }
          if(params.contact){
            formData.append('contact', params.contact);
          }
          if(params.site){
            formData.append('site', params.site);
          }
          if(params?.referenceNumber){
            formData.append('referenceNumber', params.referenceNumber);
          }
          if(params?.versionNo){
            formData.append('versionNo', params.versionNo);
          }
          if(params?.displayName){
            formData.append('displayName', params?.displayName);
            formData.append('name', params?.displayName);
          }
          if(params?.description){
            formData.append('description', params?.description);
          }
          if(params?.documentCategory){
            formData.append('documentCategory', params?.documentCategory?._id);
          }
          if(params?.documentType){
            formData.append('documentType', params?.documentType?._id);
            formData.append('doctype', params?.documentType?._id);
          }
          if (params?.files) {
            params?.files?.forEach((file, index) => {
              formData.append(`images`, file);
            });
          }
      await axios.post(`${CONFIG.SERVER_URL}documents/document/`, formData );
      dispatch(slice.actions.setResponseMessage('Document saved successfully'));
      dispatch(getDocuments( customerId, machineId ));
      dispatch(setDocumentFormVisibility(false));
      dispatch(setDocumentEditFormVisibility (false));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Document-------------------------------------

export function updateDocument(documentId , params, customerId, machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      formData.append('isActive', params?.isActive);
      formData.append('customerAccess', params.customerAccess);
      formData.append('referenceNumber', params.referenceNumber);
      if(params?.versionNo){
        formData.append('versionNo', params.versionNo);
      }
      if(params.newVersion){
        formData.append('newVersion', params.newVersion);
      }
      // if(params?.displayName){
        formData.append('displayName', params?.displayName);
        formData.append('name', params?.displayName);
      // }
      if(params?.description){
        formData.append('description', params?.description);
      }
      if(params?.documentCategory){
        formData.append('documentCategory', params?.documentCategory);
      }
      if(params?.documentType){
        formData.append('documentType', params?.documentType?._id);
        formData.append('doctype', params?.documentType?._id);
      }
      if(params?.images){
        formData.append('images', params?.images);
      }

      await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}`, formData);

      dispatch(getDocuments(customerId, machineId))
      dispatch(slice.actions.setResponseMessage(' Document updated successfully'));
      dispatch(setDocumentFormVisibility(false));
      dispatch(setDocumentEditFormVisibility (false));
      dispatch(setDocumentViewFormVisibility (true));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Documents-----------------------------------

export function getDocuments(customerId,machineId,drawing) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    const params = {
      isArchived: false,
      basic: true,
      orderBy : {
        createdAt:-1
      }
    }
    if(drawing) {
      params.forDrawing = true;
    }else if (customerId) {
      params.customer = customerId
      params.forCustomer = true;
    }else if(machineId){
      params.machine = machineId
      params.forMachine = true;
    }else{
      params.forCustomer = true;
      params.forMachine = true;
    }
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      { 
        params
      }
      );
      dispatch(slice.actions.getDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------- GET Active DOCUMENTS By Type------------------------------------

export function getActiveDocumentsByType(documentCategoryId,documentTypeId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          docCategory: documentCategoryId,
          docType: documentTypeId,
          machine: null,
        }
      }
      );
      // console.log("response : ", response);
      // if(regEx.test(response.status)){
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------- GET CUSTOMER Active DOCUMENTS------------------------------------

export function getCustomerDocuments(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          customer:customerId,
          forCustomer: true,
          machine: null,
        }
      }
      );
      // console.log("response : ", response);
      // if(regEx.test(response.status)){
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------- GET machineModel DOCUMENTS------------------------------------

export function getMachineModelDocuments(machineModelId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          machineModel:machineModelId,
        }
      }
      );
      // console.log("response : ", response);
      // if(regEx.test(response.status)){
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------- GET CUSTOMER Site DOCUMENTS------------------------------------


export function getCustomerSiteDocuments(customerSiteId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          site:customerSiteId,
          machine: null,
        }
      }
      );
      // console.log("response : ", response);
      // if(regEx.test(response.status)){
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      // }
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Machine Document-----------------------------------

export function getMachineDocuments(machineId, machineModelId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          machine: machineId,
          forMachine:true,
          // machineModel: machineModelId,
        }
      }
      );
      console.log(response);
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Machine Document-----------------------------------

export function getMachineDrawingsDocuments() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
          forDrawing:true,
        }
      }
      );
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Machine Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Active Documents-----------------------------------

export function getActiveDocuments() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` , 
      {
        params: {
          isActive: true,
          isArchived: false,
        }
      }
      );
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
} 

// -------------------------------get Document---------------------------------------

export function getDocument(documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}`);
      dispatch(slice.actions.getDocumentSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -------------------------------get Document---------------------------------------

export function getDocumentHistory(documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/${documentId}`,{
        params: {
          historical : true
        }
      });
      dispatch(slice.actions.getDocumentHistorySuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Document History Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ---------------------------------archive Document -------------------------------------

export function deleteDocument(documentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}` , 
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


