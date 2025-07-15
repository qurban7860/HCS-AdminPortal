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
  name: 'customerNote',
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


    // RESET NOTE
    resetNote(state){
      state.note = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET NOTE
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


export function addNote (customerId, params){

  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        site: params?.site?._id || null,
        contact: params?.contact?._id || null,
        note: params?.note,
        isInternal: params?.isInternal,
        isActive: params?.isActive,
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/`, data);
      return response
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function updateNote(customerId,noteId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        site: params?.site?._id || null,
        contact: params?.contact?._id || null,
        note: params?.note,
        isInternal: params?.isInternal,
        isActive: params?.isActive,
      }
      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${noteId}`, data);
      dispatch(slice.actions.setResponseMessage('Note updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  }
}

export function getNotes(id, isCustomerArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy : {
          createdAt: -1
        }
      }

      if(isCustomerArchived){
        params.archivedByCustomer = true;
        params.isArchived = true;
      }else{
        params.isArchived = false;
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${id}/notes` , { params } );
      dispatch(slice.actions.getNotesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Notes loaded successfully'));

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
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${id}/notes` , 
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

export function getNote(customerId,noteId) {
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

export function deleteNote(customerId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const response = await axios.delete(`${CONFIG.SERVER_URL}customers/notes/${id}`,
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${id}` , 
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
