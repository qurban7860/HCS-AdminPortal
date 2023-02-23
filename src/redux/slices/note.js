import sum from 'lodash/sum';
import uniq from 'lodash/uniq';
import uniqBy from 'lodash/uniqBy';
import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

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
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function saveNote(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      formData.append('note', params.noteTypes);
      if(params.customer){
        formData.append('customer', params.customer);
      }
      if(params.site){
        formData.append('site', params.site);
      }
      if(params.contact){
        formData.append('contact', params.contact);
      }
      if(params.user){
        formData.append('user', params.user);
      }

      const response = await axios.post(`${CONFIG.SERVER_URL}notes`,
        formData,
      );
      dispatch(slice.actions.setResponseMessage('Note saved successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateNote(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();

      formData.append('id', params.id);
      formData.append('note', params.note);
      if(params.customer){
        formData.append('customer', params.customer);
      }
      if(params.site){
        formData.append('site', params.site);
      }
      if(params.contact){
        formData.append('contact', params.contact);
      }
      if(params.user){
        formData.append('user', params.user);
      }
      const response = await axios.patch(`${CONFIG.SERVER_URL}customers/notes/${params.id}`,
        formData
      );
      dispatch(slice.actions.setResponseMessage('Note updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNotes() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}customers/notes`);
      console.log(response);
      console.log(response.data);
      dispatch(slice.actions.getNotesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Notes loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getNote(id) {
  console.log('slice working');
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}customers/notes/${id}`);
      dispatch(slice.actions.getNoteSuccess(response.data));
      console.log('requested note', response.data);
      // dispatch(slice.actions.setResponseMessage('Notes Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteNote(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      console.log(id);
      const response = await axios.delete(`${CONFIG.SERVER_URL}customers/notes/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


