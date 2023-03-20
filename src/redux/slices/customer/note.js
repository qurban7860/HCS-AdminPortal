// import sum from 'lodash/sum';
// import uniq from 'lodash/uniq';
// import uniqBy from 'lodash/uniqBy';
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
      // console.log('toggle', action.payload);
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setNoteEditFormVisibility(state, action){
      // console.log('setEditFormVisibility', action.payload);
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
  getCart,
  addToCart,
  setResponseMessage,
  gotoStep,
  backStep,
  nextStep,

} = slice.actions;

// ----------------------------Save Note------------------------------------------

export function saveNote(customerId,params) {
  // console.log(params)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        note: params.note,
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
      // console.log(response)
      dispatch(slice.actions.setNoteFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Note saved successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------Update Note-------------------------------------

export function updateNote(customerId,params) {
  console.log("update note params : ", params);
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const formData = new FormData();
      const data = {
        note: params.note,
      }
      data.note =  params.note;
      if(params.customer){
        data.customer = params.customer;
      }
      if(params.editSite  !== "null" && params.editSite  !== null){
          data.site =params.editSite;
      }else{
        data.site =  null
      }
      if(params.editContact !== "null" && params.editContact !== null){
          data.contact = params.editContact;
      }else{
        data.contact = null
      }
      if(params.user){
        data.user = params.user;
      }
      console.log("Update before post: ",data)
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${params.id}`, data, );
      // console.log(data)
      dispatch(slice.actions.setResponseMessage('Note updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// -----------------------------------Get Notes-----------------------------------

export function getNotes(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // const isArchived = { 
      //   isArchived: false, 
      //   customer: id 
      // }
      // console.log(id)
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${id}/notes` , 
      {
        params: {
          query: {
            isArchived: false, 
            customer: id,
          },
          populate:[
                  {path: 'contact', select: 'firstName lastName'},
                  {path: 'site', select: 'name'},
                  {path: 'user', select: 'firstName'},
                  {path: 'createdBy', select: 'firstName lastName'},
                  {path: 'updatedBy', select: 'firstName lastName'}
                  ]
        }
      }
      );
      console.log("Notes Response : ",response);
      // console.log(response.data);
      dispatch(slice.actions.getNotesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Notes loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// -------------------------------get Note---------------------------------------

export function getNote(customerId,noteId) {
  // console.log('Get Note Id');console.log(id)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerId}/notes/${noteId}`);
      dispatch(slice.actions.getNoteSuccess(response.data));
      // console.log('requested note', response.data);
      // dispatch(slice.actions.setResponseMessage('Notes Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ---------------------------------archive Note-------------------------------------

export function deleteNote(customerId,id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      // console.log(id);
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
      dispatch(slice.actions.hasError(error));
    }
  };
}


