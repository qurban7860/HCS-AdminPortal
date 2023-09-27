import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  noteFormVisibility: false,
  noteViewFormVisibility: false,
  noteEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  note: {},
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

    // SET ADD FORM TOGGLE
    setNoteFormVisibility(state, action){
      state.noteFormVisibility = action.payload;
    },

    // SET EDIT FORM TOGGLE
    setNoteEditFormVisibility(state, action){
      state.noteEditFormVisibility = action.payload;
    },

    // SET VIEW TOGGLE
    setNoteViewFormVisibility(state, action){
      state.noteViewFormVisibility = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET  Note
    getNotesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.notes = action.payload;
      state.initial = true;
    },

    // GET Note
    getNoteSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.note = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },


    // RESET LICENSE
    resetNote(state){
      state.note = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetNotes(state){
      state.notes = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
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
  setNoteFormVisibility,
  setNoteEditFormVisibility,
  setNoteViewFormVisibility,
  resetNote,
  resetNotes,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

export const NoteTypes = [ 'Type 1','Type 2','Type 3','Type 4']

// ----------------------------------------------------------------------

export function addNote (machineId, params){

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
        const data = {
            note:     params.note,
            isActive: params.isActive,
        }
        if(params.user){
            data.user =    params.user;
        }
      await axios.post(`${CONFIG.SERVER_URL}products/machines/${machineId}/notes/`, data);
      dispatch(slice.actions.setNoteFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Note saved successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

export function updateNote(machineId,noteId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        note:     params.note,
        isActive: params.isActive,
      }
      await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/notes/${noteId}`, data, );
      dispatch(slice.actions.setResponseMessage('Note updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

export function getNotes(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/machines/${id}/notes` , 
      {
        params: {
          isArchived: false,
          orderBy : {
            createdAt:-1
          }
        }
      }
      );
      dispatch(slice.actions.getNotesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Notes loaded successfully'));
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

export function deleteNote(machineId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}products/machines/${machineId}/notes/${id}` , 
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