// import sum from 'lodash/sum';
// import uniq from 'lodash/uniq';
// import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';




// ----------------------------------------------------------------------
const regEx = /^[^2]*/
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  notes: [],
  note: null,
  noteParams: {

  }
};

const slice = createSlice({
  name: 'note',
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
    // RESET NOTE
    resetNote(state){
      state.note = null;
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


    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
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
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------Save Note------------------------------------------

export function addNote(customerId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        note: params.note,
        isActive: params.isActive,
      }
      if(params.customer){
        data.customer =  params.customer;
      }
      if(params.site  !== "null" && params.site  !== null){
        data.site =   params.site;
      }else{
        data.site =   null;
      }
      if(params.contact !== "null" && params.contact !== null){
        data.contact =   params.contact;
      }else{
        data.contact =   null;
      }
      if(params.user){
        data.user =    params.user;
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/`, data);
      dispatch(slice.actions.setNoteFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Note saved successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------Update Note-------------------------------------

export function updateNote(customerId,params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        note: params.note,
        isActive: params.isActive,
        contact: params.contact,
        site: params.site
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${params.id}`, data, );
      dispatch(slice.actions.setResponseMessage('Note updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -----------------------------------Get Notes-----------------------------------

export function getNotes(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${id}/notes` , 
      {
        params: {
          isArchived: false
        }
      }
      );
      dispatch(slice.actions.getNotesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Notes loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// -------------------------------get Note---------------------------------------

export function getNote(customerId,noteId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${noteId}`);
      dispatch(slice.actions.getNoteSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Notes Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}

// ---------------------------------archive Note-------------------------------------

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
      // console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
    }
  };
}


