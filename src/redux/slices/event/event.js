import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';
import { fDate, fTimestamp } from '../../../utils/formatTime';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  event: {},
  events: [],
  openModal: false,
  selectedEventId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'event',
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

    // GET EVENTS
    getEventsSuccess(state, action) {
      state.isLoading = false;
      state.events = action.payload;
    },

    // GET EVENT
    getEventSuccess(state, action) {
      state.isLoading = false;
      state.event = action.payload;
    },

    // CREATE EVENT
    createEventSuccess(state, action) {
      const newEvent = action?.payload;
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      state.isLoading = false;
      state.events = state.events.map((event) => {
        if (event._id === action.payload._id) {
          return action.payload;
        }
        return event;
      });
    },
    // UPDATE EVENT
        updateEventDateLocal(state, action) {
      state.events = action.payload
    },

    // DELETE EVENTS
    deleteEventSuccess(state, action) {
      const eventId = action.payload;
      state.events = state.events.filter((event) => event._id !== eventId);
    },

    // SELECT EVENTS
    selectEvent(state, action) {
      const eventId = action.payload;
      state.openModal = true;
      state.selectedEventId = eventId;
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.openModal = true;
      state.selectedRange = { start, end };
    },

    // OPEN MODAL
    onOpenModal(state) {
      state.openModal = true;
    },

    // CLOSE MODAL
    onCloseModal(state) {
      state.openModal = false;
      state.selectedEventId = null;
      state.selectedRange = null;
    },
    // RESET EVENTS
    resetEvents(state) {
      state.events = [];
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { 
  onOpenModal, 
  onCloseModal, 
  selectEvent, 
  selectRange,
  updateEventDateLocal,
  resetEvents,
} = slice.actions;

// ----------------------------------------------------------------------

export function getEvents(date, customer) {
  return async (dispatch) => {
    dispatch(resetEvents());
    dispatch(slice.actions.startLoading());
    try {
      const params= {
        isArchived: false,
        isActive: true,
        customer,
      }
      if(date){
        params.month = (Number(date?.getMonth())+1)
        params.year = date?.getFullYear()
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}calender/events`, { params } );
      dispatch(slice.actions.getEventsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

export function getEvent(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}calender/events/${id}`);
      dispatch(slice.actions.getEventSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function createEvent(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const newStartDate = new Date(params?.start )
      const newDate = new Date(params?.eventDate); 
      newDate.setHours(newStartDate.getHours(), newStartDate.getMinutes(), newStartDate.getSeconds(), newStartDate.getMilliseconds());
      const data = {
        start: newDate || null,
        end: params?.end,
        customer: params?.customer?._id || null,
        machine: params?.machine?._id || null,
        site: params?.site?._id || null,
        jiraTicket: params?.jiraTicket || '',
        primaryTechnician: params?.primaryTechnician?._id || '',
        supportingTechnicians: params?.supportingTechnicians?.map((el)=> el?._id) || [] ,
        notifyContacts: params?.notifyContacts?.map((el)=> el?._id) || [],
        description: params?.description || '',
      };
      
      if(params?.allDay){
        data.start = new Date(new Date().setHours(7, 0, 0));
        data.end = new Date(new Date().setHours(18, 0, 0));
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}calender/events`, data);
      dispatch(slice.actions.createEventSuccess(response.data.Event));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
 
// ----------------------------------------------------------------------

export function updateEventDate(id, date) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        start:  date,
        end: date,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, data);
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

export function updateEvent(id, params) {
  
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const newStartDate = new Date(params?.start )
      const newDate = new Date(params?.start); 
      newDate.setHours(newStartDate.getHours(), newStartDate.getMinutes(), newStartDate.getSeconds(), newStartDate.getMilliseconds());
      const data = {
        start: newDate || null,,
        end: params?.end,
        customer: params?.customer?._id || null,
        machine: params?.machine?._id || null,
        site: params?.site?._id || null,
        jiraTicket: params?.jiraTicket || '',
        primaryTechnician: params?.primaryTechnician?._id || '',
        supportingTechnicians: params?.supportingTechnicians?.map((el)=> el?._id) || [] ,
        notifyContacts: params?.notifyContacts?.map((el)=> el?._id) || [],
        description: params?.description || '',
      };

      if(params?.allDay){
        data.start = new Date(new Date().setHours(7, 0, 0));
        data.end = new Date(new Date().setHours(18, 0, 0));
      }

      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, data);
      dispatch(slice.actions.updateEventSuccess(response.data.Event));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteEvent(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, { 
        isArchived: true, 
       });
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
