import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  portalKey: null,
  machineSerialNo: null,
  computerGUID: null,
  IPC_SerialNo: null,
  integtrationDetails: {},
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'machineIntegration',
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

    // GET Integration Record
    getIntegrationSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.portalKey = action.payload?.portalKey ? action.payload?.portalKey : null;
      state.machineSerialNo = action.payload?.machineSerialNo ? action.payload?.machineSerialNo : null;
      state.computerGUID = action.payload?.computerGUID ? action.payload?.computerGUID : null;
      state.IPC_SerialNo = action.payload?.IPC_SerialNo ? action.payload?.IPC_SerialNo : null;
      state.integtrationDetails = action.payload;
      state.initial = true;
    },

    setIntegrationRecord(state, action) {
      state.portalKey = action.payload?.portalKey ? action.payload?.portalKey : null;
      state.machineSerialNo = action.payload?.machineSerialNo ? action.payload?.machineSerialNo : null;
      state.computerGUID = action.payload?.computerGUID ? action.payload?.computerGUID : null;
      state.IPC_SerialNo = action.payload?.IPC_SerialNo ? action.payload?.IPC_SerialNo : null;
      state.integtrationDetails = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET LICENSE
    resetIntegrationRecord(state){
      state.note = {};
      state.integtrationDetails = {};
      state.success = false;
      state.isLoading = false;
    },

  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  // setNoteFormVisibility,
  // setNoteEditFormVisibility,
  // setNoteViewFormVisibility,
  // resetNote,
  // resetNotes,
  setResponseMessage,
} = slice.actions;


// ----------------------------------------------------------------------

export function addIntegrationRecord(machineId, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        portalKey: params?.portalKey,
        machineSerialNo: params?.machineSerialNo,
        ...(params?.computerGUID && {computerGUID: params.computerGUID}),
        ...(params?.IPC_SerialNo && {IPC_SerialNo: params.IPC_SerialNo}),
      };

      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/integration/`, data);
      // dispatch(slice.actions.setNoteFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Record saved successfully'));
      dispatch(slice.actions.setIntegrationRecord(response.data?.MachineIntegrationRecord));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// export function updateNote(machineId,noteId,params) {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const data = {
//         note:     params.note,
//         isActive: params.isActive,
//       }
//       await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/notes/${noteId}`, data, );
//       dispatch(slice.actions.setResponseMessage('Note updated successfully'));

//     } catch (error) {
//       console.log(error);
//       dispatch(slice.actions.hasError(error.Message));
//       throw error;
//     }
//   }
// }

// export function getNotes( id, isMachineArchived) {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const params = {
//         isArchived: false,
//         orderBy : {
//           createdAt: -1
//         }
//       }
//     if( isMachineArchived ){
//       params.archivedByMachine = true;
//       params.isArchived = true;
//     } 
      
//       const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${id}/notes`, { params });
//       dispatch(slice.actions.getNotesSuccess(response.data));
//       dispatch(slice.actions.setResponseMessage('Notes loaded successfully'));
//     } catch (error) {
//       console.log(error);
//       dispatch(slice.actions.hasError(error.Message));
//       throw error;
//     }
//   };
// }

export function getIntegrationRecord(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/integration`, {
        validateStatus (status) {
          // Accept any status code, but keep 404 in try block
          return status >= 200 && status < 300 || status === 404; // Accept 404 as valid response
      }
      });
      dispatch(slice.actions.getIntegrationSuccess(response.data?.message ? response.data?.message : response.data?.MachineIntegrationRecord))
      // if (response.status !== 404 ) dispatch(slice.actions.getIntegrationSuccess(response.data))
      // else return { status: 404, msg: response.data}
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}