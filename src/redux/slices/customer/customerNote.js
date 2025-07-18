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
  note: {},
  notes: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'customerNotes',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    updateNotesFromSSE(state, action) {
      state.notes = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
      state.initial = true;
    },

    // GET  Notes
    getNotesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.notes = action.payload;
      state.initial = true;
    },

    // ADD  Notes
    addNotesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.notes = action.payload;
      state.initial = true;
    },

    // UPDATE  Notes
    updateNotesSuccess(state, action) {
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

    // DELETE Note
    deleteNoteSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.notes = action.payload;
      state.initial = true;
      state.responseMessage = 'Note deleted successfully';
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET NOTE
    resetNote(state) {
      state.note = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET NOTE
    resetNotes(state) {
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
  updateNotesFromSSE,
  resetNote,
  resetNotes,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;


export function addNote(customerId, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        note: params?.note,
        isInternal: params?.isInternal,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/`, data);
      dispatch(slice.actions.getNotesSuccess(response.data?.notesList));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function updateNote(customerId, noteId, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        note: params?.note,
        isInternal: params?.isInternal,
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${noteId}`, data);
      dispatch(slice.actions.getNotesSuccess(response.data?.notesList));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

export function getNotes(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { isArchived: false };
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes`, { params: data });
      dispatch(slice.actions.getNotesSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getActiveNotes(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${id}/notes`,
        {
          params: {
            isActive: true,
            isArchived: false
          }
        }
      );
      dispatch(slice.actions.getActiveNotesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Notes loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function getNote(customerId, noteId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${noteId}`);
      dispatch(slice.actions.getNoteSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteNote(customerId, noteId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        isArchived: true,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${noteId}`, data);
      dispatch(slice.actions.deleteNoteSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
