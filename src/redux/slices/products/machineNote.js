import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  notes: [],
  note: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'machinenote',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // SET TOGGLE
    setNoteFormVisibility(state, action){
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setNoteEditFormVisibility(state, action){
      state.noteEditFormVisibility = action.payload;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Notes
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


    // RESET NOTE
    resetNote(state){
      state.note = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET NOTES
    resetNotes(state){
      state.notes = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
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
  resetNote,
  resetNotes,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------Save Note------------------------------------------

export function addNote(machineId,params) {
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
  };
}

// ---------------------------------Update Note-------------------------------------

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
  };
}

// -----------------------------------Get Notes-----------------------------------

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

// -------------------------------get Note---------------------------------------

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

// ---------------------------------archive Note-------------------------------------

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


