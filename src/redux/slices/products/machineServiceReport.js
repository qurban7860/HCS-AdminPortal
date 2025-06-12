import { createSlice } from '@reduxjs/toolkit';

// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  resetFlags: true,
  responseMessage: null,
  success: false,
  error: null,
  isLoading: false,
  isLoadingFiles: false,
  isLoadingReportNote: false,
  isUpdatingReportStatus: false,
  isLoadingCheckItems: false,
  submittingCheckItemIndex: -1,
  machineServiceReport: {},
  machineServiceReports: [],
  machineServiceReportHistory: [],
  activeMachineServiceReports: [],
  machineServiceReportCheckItems: [],
  sendEmailDialog: false,
  pdfViewerDialog: false,
  isReportDoc: false,
  addReportDocsDialog: false,
  completeDialog: false,
  formActiveStep: 0,
  isHistorical: false,
  isDetailPage: false,
  filterBy: '',
  filterByStatus: null,
  filterByStatusType: [],
  reportFilterBy: '',
  reportFilterByStatus: null,
  reportFilterByStatusType: ['To Do', 'In Progress'],
  page: 0,
  rowsPerPage: 100,
  reportHiddenColumns: {
    "checkboxes": false,
    "serviceDate": false,
    "serviceReportTemplate.reportType": false,
    "serviceReportUID": false,
    "customer.name": false,
    "status.name": false,
    "createdBy.name": false,
  },
};

const slice = createSlice({
  name: 'machineServiceReport',
  initialState,
  reducers: {

    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },
    // START LOADING
    startLoadingFiles(state) {
      state.isLoadingFiles = true;
    },
    startUpdatingReportStatus(state) {
      state.isUpdatingReportStatus = true;
    },
    endUpdatingReportStatus(state, action) {
      state.isUpdatingReportStatus = false;
    },
    // START LOADING CHECK ITEMS
    startLoadingCheckItems(state) {
      state.isLoadingCheckItems = true;
    },

    startLoadingReportNote(state) {
      state.isLoadingReportNote = true;
    },

    setSubmittingCheckItemIndex(state, action) {
      state.submittingCheckItemIndex = action.payload;
    },

    // SET HISTORICAL FLAG
    resetSubmittingCheckItemIndex(state) {
      state.submittingCheckItemIndex = -1;
    },

    setResetFlags(state, action) {
      state.resetFlags = action.payload;
    },

    // SET ALL TOGGLEs
    setAllFlagsFalse(state, action) {
      state.sendEmailDialog = false;
      state.pdfViewerDialog = false;
      state.isHistorical = false;
    },
    // SET HISTORICAL FLAG
    setHistoricalFlag(state, action) {
      state.isHistorical = action.payload;;
    },
    // SET DETAIL PAGE FLAG
    setDetailPageFlag(state, action) {
      state.isDetailPage = action.payload;;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.isLoadingCheckItems = false;
      state.isLoadingReportNote = false;
      state.isUpdatingReportStatus = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET MACHINE SERVICE PARAM
    getMachineServiceReportsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceReports = action.payload;
      state.initial = true;
    },
    // GET MACHINE SERVICE PARAM
    getMachineServiceReportHistorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceReportHistory = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getActiveMachineServiceReportsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeMachineServiceReports = action.payload;
      state.initial = true;
    },

    // GET MACHINE Active SERVICE PARAM
    getMachineServiceReportSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceReport = action.payload;
      state.initial = true;
    },


    getMachineServiceReportCheckItemsSuccess(state, action) {
      state.isLoadingCheckItems = false;
      state.isLoading = false;
      state.success = true;
      state.machineServiceReportCheckItems = action.payload;
      state.initial = true;
    },

    updateMachineServiceReportStatusSuccess(state, action) {
      state.isUpdatingReportStatus = false;
      state.machineServiceReport = {
        ...state.machineServiceReport,
        status: action.payload
      }
    },

    updateMachineServiceReportCheckItems(state, action) {
      const { Index, childIndex, checkItem } = action.payload;

      // Create new copies of the state to maintain immutability
      const checkItemList = [...state.machineServiceReportCheckItems.checkItemLists];
      const checkItems = [...checkItemList[Index].checkItems];
      const targetCheckItem = { ...checkItems[childIndex] };

      // Ensure historicalData is an array
      const historicalData = Array.isArray(targetCheckItem.historicalData)
        ? [...targetCheckItem.historicalData]
        : [];

      // Handle merging of files
      const existingFiles = (historicalData[0]?.files || []);
      const newFiles = checkItem.files || [];
      const mergedFiles = [...existingFiles, ...newFiles];

      historicalData[0] = {
        ...checkItem,
        files: mergedFiles,
      };

      // Update the target check item with the modified historicalData
      targetCheckItem.historicalData = historicalData;

      // Replace the updated check item in the checkItems array
      checkItems[childIndex] = targetCheckItem;

      // Replace the updated checkItems in the checkItemList
      checkItemList[Index] = {
        ...checkItemList[Index],
        checkItems,
      };

      // Update the state with the modified checkItemLists
      state.machineServiceReportCheckItems = {
        ...state.machineServiceReportCheckItems,
        checkItemLists: checkItemList,
      };
    },

    deleteMachineServiceReportCheckItems(state, action) {
      const { Index, childIndex } = action.payload;

      // Create new copies of the state to maintain immutability
      const checkItemList = [...state.machineServiceReportCheckItems.checkItemLists];
      const checkItems = [...checkItemList[Index].checkItems];
      const targetCheckItem = { ...checkItems[childIndex] };

      // Ensure historicalData is an array
      const historicalData = Array.isArray(targetCheckItem.historicalData)
        ? [...targetCheckItem.historicalData]
        : [];

      // Remove the entry at index 0
      if (historicalData.length > 0) {
        historicalData.splice(0, 1); // Remove the first item in the array
      }

      // Update the target check item with the modified historicalData
      targetCheckItem.historicalData = historicalData;

      // Replace the updated check item in the checkItems array
      checkItems[childIndex] = targetCheckItem;

      // Replace the updated checkItems in the checkItemList
      checkItemList[Index] = {
        ...checkItemList[Index],
        checkItems,
      };

      // Update the state with the modified checkItemLists
      state.machineServiceReportCheckItems = {
        ...state.machineServiceReportCheckItems,
        checkItemLists: checkItemList,
      };
    },

    addMachineServiceReportCheckItems(state, action) {
      const { Index, childIndex, checkItem } = action.payload;

      // Create new copies of the state to maintain immutability
      const checkItemList = [...state.machineServiceReportCheckItems.checkItemLists];
      const checkItems = [...checkItemList[Index].checkItems];
      const targetCheckItem = { ...checkItems[childIndex] };

      // Ensure historicalData is an array
      const historicalData = Array.isArray(targetCheckItem.historicalData)
        ? [...targetCheckItem.historicalData]
        : [];

      // Create a new entry with merged files
      const newEntry = {
        ...checkItem,
        files: [
          ...(checkItem.files || []), // New files from the payload
        ],
      };

      // Add the new entry to the beginning of historicalData
      historicalData.unshift(newEntry);

      // Update the target check item with the modified historicalData
      targetCheckItem.historicalData = historicalData;

      // Replace the updated check item in the checkItems array
      checkItems[childIndex] = targetCheckItem;

      // Replace the updated checkItems in the checkItemList
      checkItemList[Index] = {
        ...checkItemList[Index],
        checkItems,
      };

      // Update the state with the modified checkItemLists
      state.machineServiceReportCheckItems = {
        ...state.machineServiceReportCheckItems,
        checkItemLists: checkItemList,
      };
    },

    deleteMachineServiceReportCheckItemFileSuccess(state, action) {
      const { Index, childIndex, checkItem } = action.payload;
      const checkItemFiles = [...state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue.files]
      state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue = {
        ...state.machineServiceReportCheckItems.checkItemLists[Index].checkItems[childIndex].reportValue,
        files: checkItemFiles?.filter(file => file._id !== checkItem)
      };
    },


    // GET MACHINE Active SERVICE PARAM
    updateMachineServiceReportSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.machineServiceReport = action.payload;
      state.initial = true;
    },

    addServiceReportNoteSuccess(state, action) {
      const { name, data } = action.payload;
      const array = state.machineServiceReport[name];
      if (Array.isArray(array)) {
        state.machineServiceReport[name] = [data, ...array];
      } else {
        state.machineServiceReport[name] = [data];
      }
      state.isLoadingReportNote = false;
    },

    updateServiceReportNoteSuccess(state, action) {
      const { name, data } = action.payload;
      const array = state.machineServiceReport[name];
      if (Array.isArray(array) && array.length > 0) {
        state.machineServiceReport[name] = [data, ...array.slice(1)];
      } else {
        state.machineServiceReport[name] = [data];
      }
      state.isLoadingReportNote = false;
    },

    deleteServiceReportNoteSuccess(state, action) {
      const { name } = action.payload;
      const array = state.machineServiceReport[name];
      if (Array.isArray(array) && array?.length > 0) {
        state.machineServiceReport = {
          ...state.machineServiceReport,
          [name]: array?.slice(1)
        };
      }
      state.isLoadingReportNote = false;
    },

    addServiceReportFilesSuccess(state, action) {
      state.isLoading = false;
      state.isLoadingFiles = false;
      if (action.payload?.isReportDoc) {
        state.machineServiceReport = {
          ...state.machineServiceReport,
          reportDocs: [...(state.machineServiceReport?.reportDocs || []), ...(action.payload?.files || [])]
        }
      } else {
        state.machineServiceReport = {
          ...state.machineServiceReport,
          files: [...(state.machineServiceReport?.files || []), ...(action.payload?.files || [])]
        }
      }
    },

    deleteServiceReportFileSuccess(state, action) {
      state.isLoading = false;
      const { id } = action.payload;
      const array = state.machineServiceReport.files;
      if (Array.isArray(array) && array?.length > 0) {
        state.machineServiceReport = {
          ...state.machineServiceReport,
          files: state.machineServiceReport?.files?.filter(f => f?._id !== id) || []
        };
      }
      state.isLoadingReportNote = false;
    },

    // SET SEND EMAIL DIALOG
    setSendEmailDialog(state, action) {
      state.sendEmailDialog = action.payload;
    },

    // SET PDF DIALOG
    setPDFViewerDialog(state, action) {
      state.pdfViewerDialog = action.payload;
    },

    // SET ADD FILE DIALOG
    setAddReportDocsDialog(state, action) {
      state.addReportDocsDialog = action.payload;
    },

    // SET ADD FILE DIALOG
    setIsReportDoc(state, action) {
      state.isReportDoc = action.payload;
    },

    // SET COMLETE DIALOG
    setCompleteDialog(state, action) {
      state.completeDialog = action.payload;
    },

    // SET COMLETE DIALOG
    setFormActiveStep(state, action) {
      state.formActiveStep = action.payload;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET MACHINE TECH PARAM
    resetMachineServiceReport(state) {
      state.machineServiceReport = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET MACHINE TECH PARAM
    resetCheckItemValues(state) {
      state.checkItemReportValues = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoadingCheckItems = false;
    },

    // RESET MACHINE TECH PARAM
    resetMachineServiceReports(state) {
      state.machineServiceReports = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },

    // Set FilterBy
    setFilterByStatus(state, action) {
      state.filterByStatus = action.payload;
    },

    // Set FilterBy
    setFilterByStatusType(state, action) {
      state.filterByStatusType = action.payload;
    },

    // Set REPORT FilterBy
    setReportFilterBy(state, action) {
      state.reportFilterBy = action.payload;
    },

    // Set ReportFilterBy
    setReportFilterByStatus(state, action) {
      state.reportFilterByStatus = action.payload;
    },

    // Set ReportFilterBy
    setReportFilterByStatusType(state, action) {
      state.reportFilterByStatusType = action.payload;
    },

    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
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
  setResetFlags,
  setHistoricalFlag,
  setDetailPageFlag,
  setAllFlagsFalse,
  setSendEmailDialog,
  setPDFViewerDialog,
  setAddReportDocsDialog,
  setIsReportDoc,
  setCompleteDialog,
  setFormActiveStep,
  resetMachineServiceReports,
  resetMachineServiceReport,
  resetCheckItemValues,
  resetSubmittingCheckItemIndex,
  setResponseMessage,
  setFilterBy,
  setFilterByStatus,
  setFilterByStatusType,
  setReportFilterBy,
  setReportFilterByStatus,
  setReportFilterByStatusType,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns,
} = slice.actions;

// ----------------------------------------------------------------------

export function sendEmail(machineId, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      formData.append('email', data.email)
      formData.append('pdf', data.pdf)
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${data.id}/sendEmail`, formData);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getActiveMachineServiceReports(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports`,
        {
          params: {
            isArchived: false,
            isActive: true
          }
        }
      );
      await dispatch(slice.actions.getActiveMachineServiceReportsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

export function getMachineServiceHistoryReports(machineId, primaryServiceReportId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports`,
        {
          params: {
            isArchived: false,
            // isHistory: true,
            primaryServiceReportId,
          }
        }
      );
      dispatch(slice.actions.getMachineServiceReportHistorySuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------

export function getMachineServiceReportVersion(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await dispatch(resetMachineServiceReport());
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/values`);
      dispatch(slice.actions.getMachineServiceReportSuccess(response.data));
      dispatch(setHistoricalFlag(true));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

// ------------------------------------------------------------------------------------------------


export function getMachineServiceReports(param) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const { page, rowsPerPage, machineId, isMachineArchived, status } = param
      const params = {
        isArchived: false,
        $or: [],
        orderBy: { createdAt: -1 },
        pagination: { page, rowsPerPage },
      };

      if (Array.isArray(status) && status.length > 0) {
        params.$or.push({ status: { $in: status } });
      }

      if (isMachineArchived) {
        params.archivedByMachine = true;
        params.isArchived = true;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports`, { params });
      dispatch(slice.actions.getMachineServiceReportsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}


// ----------------------------------------------------------------------
export function getMachineServiceReport(machineId, id, isHighQuality) {
  return async (dispatch) => {
    if (!isHighQuality) {
      dispatch(slice.actions.startLoading());
    }
    try {
      const params = {};
      if (isHighQuality) {
        params.isHighQuality = true;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}`, { params });
      await dispatch(slice.actions.getMachineServiceReportSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

//----------------------------------------------------------------

export function deleteServiceReportNote(serviceReportId, id, name) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoadingReportNote());
      await axios.delete(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes/${id}`, { isArchived: true });
      dispatch(slice.actions.deleteServiceReportNoteSuccess({ name }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------------------------------

export function deleteMachineServiceReport(machineId, id, status) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}`,
        {
          isArchived: true,
          isActive: false,
          status
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

export function addMachineServiceReport(machineId, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        serviceReportTemplate: params?.serviceReportTemplate?._id,
        serviceDate: params?.serviceDate,
        versionNo: params?.versionNo,
        customer: params?.customer,
        site: params?.site,
        status: params?.status || 'DRAFT',
        machine: machineId,
        decoilers: params?.decoilers?.map((dec) => dec?._id),
        technicians: params?.technicians,
        technicianNotes: params?.technicianNotes,
        textBeforeCheckItems: params?.textBeforeCheckItems,
        textAfterCheckItems: params?.textAfterCheckItems,
        reportSubmition: params?.reportSubmition,
        serviceNote: params?.serviceNote,
        recommendationNote: params?.recommendationNote,
        internalComments: params?.internalComments,
        suggestedSpares: params?.suggestedSpares,
        internalNote: params.internalNote,
        operators: params?.operators?.map((ope) => ope?._id) || [],
        operatorNotes: params?.operatorNotes || '',
        checkItemReportValues: params?.checkItemReportValues || [],
        isReportDocsOnly: params?.isReportDocsOnly,
        isActive: params?.isActive
      }
      // const formData = new FormData();
      // formData.append('serviceReportTemplate', params?.serviceReportTemplate?._id || null);
      // formData.append('serviceDate', params?.serviceDate);
      // formData.append('versionNo', params?.versionNo);
      // formData.append('customer', params?.customer || null);
      // formData.append('site', params?.site || null);
      // formData.append('machine', machineId);
      // formData.append(`decoilers`, params?.decoilers?.map((dec) => dec?._id) || []);
      // formData.append('technician', params?.technician?._id || null);
      // formData.append('technicianNotes', params?.technicianNotes);
      // formData.append('textBeforeCheckItems', params?.textBeforeCheckItems);
      // formData.append('textAfterCheckItems', params?.textAfterCheckItems);
      // formData.append('serviceNote', params?.serviceNote);
      // formData.append('recommendationNote', params?.recommendationNote);
      // formData.append('internalComments', params?.internalComments);
      // formData.append('suggestedSpares', params?.suggestedSpares);
      // formData.append('internalNote', params.internalNote);
      // formData.append('operators', params?.operators?.map((ope)=> ope?._id) || []);
      // formData.append('operatorNotes', params.operatorNotes);
      // formData.append('checkItemReportValues', JSON.stringify(params?.checkItemReportValues || []));
      // formData.append('isActive', params?.isActive);

      // if (Array.isArray(params?.files) &&  params?.files?.length > 0) {
      //   params?.files?.forEach((file, index) => {
      //     if (file) {
      //       formData.append('images', file );
      //     }
      //   });
      // }

      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports`, data);
      dispatch(slice.actions.getMachineServiceReportSuccess(response.data));

      return response?.data;

    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}
// --------------------------------------------------------------------------

export function updateMachineServiceReportStatus(machineId, id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startUpdatingReportStatus());
    try {
      const data = { status: params?.status?._id }
      await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/status`, data);
      await dispatch(slice.actions.updateMachineServiceReportStatusSuccess(params?.status));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}

// --------------------------------------------------------------------------

export function sendToDraftMachineServiceReportStatus(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startUpdatingReportStatus());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/sendToDraft`);
      await dispatch(slice.actions.endUpdatingReportStatus());
      await dispatch(slice.actions.getMachineServiceReportSuccess(response?.data?.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}

// --------------------------------------------------------------------------

export function addServiceReportNote(serviceReportId, name, data) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoadingReportNote());
      const params = {
        [name]: {
          note: data?.note,
          technicians: data?.technicians?.map(tn => tn?._id),
          operators: data?.operators?.map(op => op?._id),
          isPublic: data?.isPublic,
        }
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes`, params);
      await dispatch(slice.actions.addServiceReportNoteSuccess({ name, data: response.data }));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError());
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function updateServiceReportNote(serviceReportId, Id, name, data) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoadingReportNote());
      const params = {
        note: data?.note || "",
        technicians: data?.technicians,
        operators: data?.operators,
        isPublic: data?.isPublic,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/notes/${Id}`, params);
      await dispatch(slice.actions.updateServiceReportNoteSuccess({ name, data: response.data }));
    } catch (error) {
      dispatch(slice.actions.hasError());
      throw error;
    }
  };
}

// --------------------------------------------------------------------------

export function updateMachineServiceReport(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        // serviceReportTemplate:        params?.serviceReportTemplate,
        serviceDate: params?.serviceDate,
        versionNo: params?.versionNo,
        customer: params?.customer,
        site: params?.site,
        machine: machineId,
        technicians: params?.technicians,
        technicianNotes: params?.technicianNotes,
        textBeforeCheckItems: params?.textBeforeCheckItems,
        textAfterCheckItems: params?.textAfterCheckItems,
        reportSubmition: params?.reportSubmition,
        serviceNote: params?.serviceNote,
        recommendationNote: params?.recommendationNote,
        internalComments: params?.internalComments,
        suggestedSpares: params?.suggestedSpares,
        internalNote: params?.internalNote,
        operators: params?.operators,
        operatorNotes: params?.operatorNotes,
        checkItemReportValues: params?.checkItemReportValues,
        status: params?.status,
        update: params?.update,
        isReportDocsOnly: params?.isReportDocsOnly,
        isActive: params?.isActive,
        primaryServiceReportId: params?.primaryServiceReportId,
        emails: params?.emails,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}`, data);
      if (typeof response?.data !== 'string' && !response?.data?.message) {
        await dispatch(slice.actions.updateMachineServiceReportSuccess(response?.data));
      }
      return response?.data?.serviceReport;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };

}

export function addMachineServiceReportFiles(machineId, id, params) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoadingFiles());
      const formData = new FormData();
      if (Array.isArray(params?.files) && params?.files?.length > 0) {
        if (params?.isReportDoc) {
          formData.append('isReportDoc', params?.isReportDoc);
        }
        params?.files?.forEach((file, index) => {
          if (file) {
            formData.append('images', file);
          }
        });
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/files/`, formData);
      if (params?.isReportDoc) {
        response.data.isReportDoc = true
      }
      dispatch(slice.actions.addServiceReportFilesSuccess(response?.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function downloadReportFile(machineId, id, fileId) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/files/${fileId}/download/`);
    dispatch(slice.actions.resetSubmittingCheckItemIndex());
    return response;
  };
}

export function deleteReportFile(machineId, id, fileId) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.startLoading());
      await axios.delete(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/files/${fileId}/`, { isArchived: true });
      dispatch(slice.actions.deleteServiceReportFileSuccess({ id: fileId }));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function downloadCheckItemFile(machineId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/files/${id}/download/`);
    dispatch(slice.actions.resetSubmittingCheckItemIndex());
    return response;
  };
}

export function deleteCheckItemFile(machineId, fileId, Index, childIndex) {
  return async (dispatch) => {
    dispatch(slice.actions.setSubmittingCheckItemIndex());
    try {
      await axios.delete(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/files/${fileId}/`,
        {
          isArchived: true,
        });
      dispatch(slice.actions.deleteMachineServiceReportCheckItemFileSuccess({ Index, childIndex, checkItem: fileId }));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


export function getMachineServiceReportCheckItems(machineId, id, highQuality) {
  return async (dispatch) => {
    if (!highQuality) {
      dispatch(slice.actions.startLoadingCheckItems());
    }
    try {
      const params = {}
      if (highQuality) {
        params.highQuality = true;
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/${id}/checkItems`, { params });
      await dispatch(slice.actions.getMachineServiceReportCheckItemsSuccess(response.data));
      return response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function addCheckItemValues(machineId, data, Index, childIndex) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append('serviceReport', data.serviceReport);
      formData.append('checkItemListId', data.checkItemListId);
      formData.append('machineCheckItem', data.machineCheckItem);
      formData.append('checkItemValue', data.checkItemValue);
      formData.append('comments', data.comments);

      if (Array.isArray(data?.images) && data?.images?.length > 0) {
        data?.images?.filter(image => !image.uploaded)?.forEach((image, index) => {
          if (image && !image?._id) {
            formData.append('images', image);
          }
        });
      }

      let response;

      if (data?._id) {
        response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/${data?._id}`, formData);
        await dispatch(slice.actions.updateMachineServiceReportCheckItems({ Index, childIndex, checkItem: { ...response.data } }));
      } else {
        response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/`, formData);
        await dispatch(slice.actions.addMachineServiceReportCheckItems({ Index, childIndex, checkItem: { ...response.data } }));
      }

      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteCheckItemValues(machineId, Id, Index, childIndex) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append('isActive', false);
      formData.append('isArchived', true);
      await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReportValues/${Id}`, formData);
      await dispatch(slice.actions.deleteMachineServiceReportCheckItems({ Index, childIndex }));
    } catch (error) {
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


export function sendMachineServiceReportForApproval(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        machine: machineId,
        ...params
      };
      const response = await axios.post(
        `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/sendApprovalEmail`,
        data
      );
      dispatch(slice.actions.getMachineServiceReportSuccess(response?.data));
      return response?.data
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
export function approveServiceReportRequest(machineId, id, params) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const data = {
        machine: machineId,
        serviceReportId: id,
        evaluationData: params
      };
      const response = await axios.post(
        `${CONFIG.SERVER_URL}products/machines/${machineId}/serviceReports/${id}/approveReport`,
        data
      );
      dispatch(slice.actions.getMachineServiceReportSuccess(response?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}