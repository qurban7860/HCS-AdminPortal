import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  // customer 
  customerDialog: null,
  contactDialog: null,
  siteDialog: null,
  // event
  eventDialog: null,
  // article
  helpDrawer: null,
  articleFileDialog: null,
  // user
  userDialog: null,
  changePasswordDialog: null,
  changePasswordByAdminDialog: null,
  emailDialog: null,
  // machine
  machineDialog: null,
  connectedMachineAddDialog: null,
  machineStatusChangeDialog: null,
  machineSettingValueDialog: null,
  machineTransferDialog: null,
  apiLogDialog: null,
  profileFileDialog: null,
  serviceReportFileDialog: null,
  serviceReportCompleteDialog: null,
  serviceReportEmailDialog: null,
  // ticket
  ticketFileDialog: null,
  // document
  documentTypeMergeDialog: null,
  documentVersionDialog: null,
  pdfViewerDialog: null,
  imageViewerDialog: null,
  // general
  deleteConfirmDialog: null,
  discardConfirmDialog: null,
  pm2FullScreenDialog: null,
  portalRequestDialog: null,
  portalRequestInviteDialog: null
};

const slice = createSlice({
  name: 'dialogManager',
  initialState,
  reducers: {
  // customer 
  setCustomerDialog(state, action) {
    state.customerDialog = action.payload;
  },
  setContactDialog(state, action) {
    state.contactDialog = action.payload;
  },
  setSiteDialog(state, action) {
    state.siteDialog = action.payload;
  },
  // event
  setEventDialog(state, action) {
    state.eventDialog = action.payload;
  },
  // article
  setHelpDrawer(state, action) {
    state.helpDrawer = action.payload;
  },
  setArticleFileDialog(state, action) {
    state.articleFileDialog = action.payload;
  },
  // user 
  setUserDialog(state, action) {
    state.userDialog = action.payload;
  },
  setChangePasswordDialog(state, action) {
    state.changePasswordDialog = action.payload;
  },
  setChangePasswordByAdminDialog(state, action) {
    state.changePasswordByAdminDialog = action.payload;
  },
  setEmailDialog(state, action) {
    state.emailDialog = action.payload;
  },
  // machine
  setMachineDialog(state, action) {
    state.machineDialog = action.payload;
  },
  setConnectedMachineAddDialog(state, action) {
    state.connectedMachineAddDialog = action.payload;
  },
  setMachineStatusChangeDialog(state, action) {
    state.machineStatusChangeDialog = action.payload;
  },
  setMachineSettingValueDialog(state, action) {
    state.machineSettingValueDialog = action.payload;
  },
  setMachineTransferDialog(state, action) {
    state.machineTransferDialog = action.payload;
  },
  setApiLogDialog(state, action) {
    state.apiLogDialog = action.payload;
  },
  setProfileFileDialog(state, action) {
    state.profileFileDialog = action.payload;
  },
  setServiceReportFileDialog(state, action) {
    state.serviceReportFileDialog = action.payload;
  },
  setServiceReportCompleteDialog(state, action) {
    state.serviceReportCompleteDialog = action.payload;
  },
  setServiceReportEmailDialog(state, action) {
    state.serviceReportEmailDialog = action.payload;
  },
  // ticket
  setTicketFileDialog(state, action) {
    state.ticketFileDialog = action.payload;
  },
  // document
  setDocumentTypeMergeDialog(state, action) {
    state.documentTypeMergeDialog = action.payload;
  },
  setDocumentVersionDialog(state, action) {
    state.documentVersionDialog = action.payload;
  },
  setPdfViewerDialog(state, action) {
    state.pdfViewerDialog = action.payload;
  },
  setImageViewerDialog(state, action) {
    state.imageViewerDialog = action.payload;
  },
  // general
  setDeleteConfirmDialog(state, action) {
    state.deleteConfirmDialog = action.payload;
  },
  setDiscardConfirmDialog(state, action) {
    state.discardConfirmDialog = action.payload;
  },
  setPM2FullScreenDialog(state, action) {
    state.pm2FullScreenDialog = action.payload;
  },
  setPortalRequestDialog(state, action) {
    state.portalRequestDialog = action.payload;
  },
  setPortalRequestInviteDialog(state, action) {
    state.portalRequestInviteDialog = action.payload;
  }
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
    // customer 
  setCustomerDialog,
  setContactDialog,
  setSiteDialog,
  // event
  setEventDialog,
  // article
  setHelpDrawer,
  setArticleFileDialog,
  // user 
  setUserDialog,
  setChangePasswordDialog,
  setChangePasswordByAdminDialog,
  setEmailDialog,
  // machine
  setMachineDialog,
  setConnectedMachineAddDialog,
  setMachineStatusChangeDialog,
  setMachineSettingValueDialog,
  setMachineTransferDialog,
  setApiLogDialog,
  setProfileFileDialog,
  setServiceReportFileDialog,
  setServiceReportCompleteDialog,
  setServiceReportEmailDialog,
  // ticket
  setTicketFileDialog,
  // document
  setDocumentTypeMergeDialog,
  setDocumentVersionDialog,
  setPdfViewerDialog,
  setImageViewerDialog,
  // general
  setDeleteConfirmDialog,
  setDiscardConfirmDialog,
  setPM2FullScreenDialog,
  setPortalRequestDialog,
  setPortalRequestInviteDialog
} = slice.actions;


