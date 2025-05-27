import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  documentFormVisibility: false,
  documentListFormVisibility: false,
  documentEditFormVisibility: false,
  documentViewFormVisibility: false,
  documentHistoryViewFormVisibility: false,
  documentNewVersionFormVisibility: false,
  documentAddFilesViewFormVisibility: false,
  documentHistoryNewVersionFormVisibility: false,
  documentHistoryAddFilesViewFormVisibility: false,
  documentVersionEditDialogVisibility: false,
  documentGalleryVisibility: false,
  documentGallery: [],
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
  documentRowsTotal: 0,

  machineDrawingsFilterBy: '',
  machineDrawingsPage: 0,
  machineDrawingsRowsPerPage: 100,
  
  customerDocumentsFilterBy: '',
  customerDocumentsPage: 0,
  customerDocumentsRowsPerPage: 100,

  machineDocumentsFilterBy: '',
  machineDocumentsPage: 0,
  machineDocumentsRowsPerPage: 100,
  reportHiddenColumns: {
    "displayName": false,
    "referenceNumber": false,
    "docCategory.name": false,
    "docType.name": false,
    "stockNumber": false,
    "productDrawings": true,
    "machine.serialNo": false,
    "createdAt": false,
  },
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

    // SET LIST TOGGLE
    setDocumentListFormVisibility(state, action){
      state.documentListFormVisibility = action.payload;
    },

    // SET TOGGLE
    setDocumentViewFormVisibility(state, action){
      state.documentViewFormVisibility = action.payload;
    },

    // // SET TOGGLE
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
      state.documents = action.payload;
      state.documentRowsTotal = action.payload?.totalCount;
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

    setDocumentVersionEditDialogVisibility(state, action){
      state.documentVersionEditDialogVisibility = action.payload;
    },
    
    setDocumentGalleryVisibility(state, action){
      state.documentGalleryVisibility= action.payload;
    },

     // GET Machine Gallery
    getDocumentGallerySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.documentGallery = action.payload;
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
      state.documentRowsTotal = 0 ;
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
    // set HiddenColumns
    setReportHiddenColumns(state, action){
      state.reportHiddenColumns = action.payload;  
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setDocumentFormVisibility,
  setDocumentListFormVisibility,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentVersionEditDialogVisibility,
  setDocumentGalleryVisibility,
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
  setReportHiddenColumns
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

          if(params?.drawingMachine){
            formData.append('drawingMachine', params?.drawingMachine);
          } else if(machineId){
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
          if(params?.stockNumber){
            formData.append('stockNumber', params.stockNumber);
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
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------Add Document------------------------------------------

export function addDocumentList( params ) {
  return async (dispatch) => {
      dispatch(slice.actions.startLoading());
      try {
        const formData = new FormData();

        if (params?.files) {
          params?.files?.forEach((file, index) => {
            if (file) {
            formData.append('docType', file?.docType?._id);
            formData.append('documentType', file?.docType?._id);
            formData.append('docCategory', file?.docCategory?._id);
            formData.append('documentCategory', file?.docCategory?._id);
            formData.append('versionNo', file?.versionNo);
            formData.append('name', file?.displayName);
            formData.append('displayName', file?.displayName);
            formData.append('referenceNumber', file?.referenceNumber);
            formData.append('stockNumber', file?.stockNumber);
            formData.append('images', file );
            }
          });
        }

    await axios.post(`${CONFIG.SERVER_URL}documents/documentmulti/`, formData );
    dispatch(slice.actions.setResponseMessage('Document saved successfully'));
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
      if(params?.documentCategory){
        formData.append('documentCategory', params?.documentCategory?._id);
        formData.append('docCategory', params?.documentCategory?._id);
      }
      if(params?.documentType){
        formData.append('documentType', params?.documentType?._id);
        formData.append('doctype', params?.documentType?._id);
      }
      if(params?.displayName){
        formData.append('displayName', params?.displayName);
        formData.append('name', params?.displayName);
      }
      formData.append('referenceNumber', params.referenceNumber);
      formData.append('stockNumber', params.stockNumber);
      if(params?.versionNo){
        formData.append('versionNo', params.versionNo);
      }
      if(params.newVersion){
        formData.append('newVersion', params.newVersion);
      }
      if(params?.description){
        formData.append('description', params?.description);
      }
      formData.append('isActive', params?.isActive);
      formData.append('customerAccess', params.customerAccess);
      if(params?.images){
        formData.append('images', params?.images);
      }

      await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}`, formData);
      
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function updateDocumentVersionNo(documentId , data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`${CONFIG.SERVER_URL}documents/document/updatedVersion/${documentId}`, data);
      dispatch(slice.actions.setResponseMessage('Document version updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Documents-----------------------------------

export function getDocuments(customerId, machineId, drawing, page, pageSize, isCustomerArchived, isMachineArchived, cancelToken, searchKey, searchColumn, docCategory, docType) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        basic: true,
        isArchived: false,
        pagination: {page, pageSize},
        ...(!drawing && {orderBy: {createdAt: -1}}),
        ...(isCustomerArchived && {archivedByCustomer: true, isArchived: true}),
        ...(isMachineArchived && {archivedByMachine: true, isArchived: true }),
        ...(searchColumn && searchKey?.length > 0 && {searchKey, searchColumn}),
        ...(docCategory && {docCategory}),
        ...(docType && {docType})
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
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` ,
      {
        params,
        cancelToken: cancelToken?.token,
      }
      );
      dispatch(slice.actions.getDocumentsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      // throw error;
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
          isVersionNeeded: false,
          docCategory: documentCategoryId,
          docType: documentTypeId,
          machine: null,
        }
      }
      );
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
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
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
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
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
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
      dispatch(slice.actions.getActiveDocumentsSuccess(response.data));
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

export function getActiveDocuments(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/` ,
      {
        params: {
          isActive: true,
          isArchived: false,
          machiine: machineId,
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

export function checkDocument(eTags) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}documents/checkFileExistenceByETag`,
      {
        params: {eTags}
      });

      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

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
          historical : true,
          isArchived : false
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

export function deleteDocument(documentId, isCheckReference) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}documents/document/${documentId}` ,
      {
          isArchived: true,
          checkReference : isCheckReference
      });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getDocumentGallery(id, customerId, machineId, page, pageSize) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const response = await axios.get(`${CONFIG.SERVER_URL}documents/document/allDocumentsAgainstFilter`,
      {
        params: {
          document:id,
          customer:customerId,
          machine:machineId,
          pagination:{
              page,
              pageSize  
  
          }
        }
      });
      dispatch(slice.actions.getDocumentGallerySuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

