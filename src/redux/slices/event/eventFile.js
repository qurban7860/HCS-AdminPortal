import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  eventFile: {},
  eventFiles: [],
};

const slice = createSlice({
  name: 'eventFile',
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
    },

    // GET EVENT FILES
    getEventFilesSuccess(state, action) {
      state.isLoading = false;
      state.eventFiles = action.payload;
    },

    // GET EVENT FILE
    getEventFileSuccess(state, action) {
      state.isLoading = false;
      state.eventFile = action.payload;
    },

    // NEW EVENT FILES
    newEventFilesSuccess(state, action) {
      state.isLoading = false;
    },


    // DELETE EVENT FILE
    deleteEventFileSuccess(state, action) {
      state.isLoading = false;
    },

  },
});

// Reducer
export default slice.reducer;


// ----------------------------------------------------------------------

export function getEventFiles( eventId ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params= {
        isArchived: false,
        isActive: true,
        event: eventId,
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}calender/events/${eventId}/files/`, { params } );
      dispatch(slice.actions.getEventFilesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

export function getEventFile( eventId, id ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}calender/events/${eventId}/files/${id}`);
      dispatch(slice.actions.getEventFileSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function uploadFiles( eventId, files ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      if(Array.isArray( files ) && files?.length > 0 ){
        files?.forEach((file, index) => {
            formData.append('images', file );
        });
      }
      
      const response = await axios.post(`${CONFIG.SERVER_URL}calender/events/files`, formData );
      dispatch(slice.actions.newEventFilesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEventFile(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, { isArchived: true, });
      await dispatch(slice.actions.deleteEventFileSuccess(response.data));
      } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
