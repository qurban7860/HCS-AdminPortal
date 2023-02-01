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


    async saveNote(state, action) {
      try {
        console.log('sites', action.payload.sites);

        const formData = new FormData();
        console.log(action.payload.department);
        formData.append('name', action.payload.name);
        formData.append('tradingName', action.payload.tradingName);
        formData.append('mainSite', action.payload.mainSite);
        formData.append('sites', action.payload.sites);
        formData.append('contacts', action.payload.contacts);
        formData.append('accountManager', action.payload.accountManager);
        formData.append('projectManager', action.payload.projectManager);
        formData.append('supportManager', action.payload.supportManager);


        const response = await axios.post(`${CONFIG.SERVER_URL}notes`,
          formData,
        );


      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

    },

    async updateNote(state, action) {
      try {

        const formData = new FormData();

        formData.append('id', action.payload.id);
        formData.append('name', action.payload.name);
        formData.append('tradingName', action.payload.tradingName);
        formData.append('mainSite', action.payload.mainSite);
        formData.append('sites', action.payload.sites);
        formData.append('contacts', action.payload.contacts);
        formData.append('accountManager', action.payload.accountManager);
        formData.append('projectManager', action.payload.projectManager);
        formData.append('supportManager', action.payload.supportManager);
        
        const response = await axios.patch(`${CONFIG.SERVER_URL}notes/${action.payload.id}`,
          formData
        );

      } catch (error) {
        console.error(error);
        this.hasError(error.message);
      }

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
  saveNote,
  updateNote,
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------------------------------------------------

export function getNotes() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}notes`);
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
      const response = await axios.get(`${CONFIG.SERVER_URL}notes/${id}`);
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
      const response = await axios.delete(`${CONFIG.SERVER_URL}notes/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
      console.log(response.data);
      // state.responseMessage = response.data;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}


