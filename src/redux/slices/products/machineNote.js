/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-extraneous-dependencies */
import { createSlice } from '@reduxjs/toolkit';


// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  comment: {},
  notes: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machineNote',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    updateNotesFromSSE(state, action) {
      state.notes = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
      state.initial = true;
    },

    // GET  Notes
    // GET  Notes
    getNotesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.notes = action.payload;
      state.initial = true;
       // state.responseMessage = 'Comments loaded successfully';
    },

    // ADD  Notes
    addNotesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.notes = action.payload;
      state.initial = true;
      state.responseMessage = 'Note saved successfully';
    },

    // UPDATE  Notes
    updateNotesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.notes = action.payload;
      state.initial = true;
      state.responseMessage = 'Note updated successfully';
       // state.responseMessage = 'Comments loaded successfully';
    },

    // GET Note
    getNoteSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.note = action.payload;
      state.initial = true;
    },

    // DELETE Note
    deleteNoteSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.notes = action.payload;
      state.responseMessage = 'Note deleted successfully';
    },
    
    
    

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET LICENSE
    resetNote(state) {
      state.note = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetNotes(state) {
      state.notes = [];  // Keep this to clear old data on unmount
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
      state.error = null;
    },
    

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
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
  updateNotesFromSSE,
  resetNote,
  resetNotes,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------



export function getNotes(machineId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived: false };
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/notes`, { params: data });
      dispatch(slice.actions.getNotesSuccess(response.data)); // Ensure response structure is correct
    } catch (error) {
      dispatch(slice.actions.hasError(error.response?.data?.message || "Failed to fetch notes"));
    }
  };
}

export function addNote(machineId, note) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {note,isArchived: false };  // Ensure new notes are not archived
      const response = await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/notes`, data);
      dispatch(slice.actions.addNotesSuccess(response.data?.notesList));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function updateNote(machineId, noteId, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        note: params.note
      };
      const response = await axios.patch(
        `${CONFIG.SERVER_URL}products/machines/${machineId}/notes/${noteId}`,
        data
      );
      dispatch(slice.actions.updateNotesSuccess(response.data?.notesList));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getNote(machineId,noteId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${machineId}/notes/${noteId}`);
      dispatch(slice.actions.getNoteSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteNote(machineId, noteId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        isArchived: true,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/notes/${noteId}`, data);
      console.log("Deleted note success:",response.data.notesList)
      dispatch(slice.actions.deleteNoteSuccess(response.data?.notesList));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

