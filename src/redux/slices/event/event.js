import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  event: {},
  events: [],
  eventModel: false,
  selectedEvent: {},
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
      const newEvent = {
        id: action.payload._id,
        title: `${action.payload?.createdBy?.name || ''}, ${action.payload?.customer?.name || ''}`,
        date: action.payload?.start,
        textColor: "#1890FF",
        extendedProps: { ...action.payload }
      }
      state.isLoading = false;
      state.events = [...state.events, newEvent];
    },

    // UPDATE EVENT
    updateEventSuccess(state, action) {
      state.isLoading = false;
      state.events = state.events.map((event) => {
        if (event.id === action.payload._id) {
          return {
            id: action.payload._id,
            title: `${action.payload?.createdBy?.name || ''}, ${action.payload?.customer?.name || ''}`,
            date: action.payload?.start,
            textColor: "#1890FF",
            extendedProps: { ...action.payload }
          };
        }
        return event;
      });
    },
    // UPDATE EVENT
    updateEventDateLocal(state, action) {
      const { id, start, end } = action.payload;
      state.events = state.events.map((event) => {
        if (event.id === id) {
          return {
            ...event,
            date: start,
            extendedProps: { ...event.extendedProps, start, end }
          };
          
        }
        return event;
      });
    },

    // DELETE EVENTS
    deleteEventSuccess(state, action) {
      const eventId = action.payload;
      state.events = state.events.filter((event) => event.id !== eventId);
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      state.selectedEvent = null;
      state.selectedRange = { start, end };
      state.eventModel = true;
    },

    setEventModel(state, action) {
      state.eventModel = action.payload;
    },

    setSelectedEvent(state, action) {
      state.selectedEvent = action.payload;
    },
    
    // RESET EVENTS
    resetEvent(state) {
      state.event = {};
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
  setEventModel,
  setSelectedEvent, 
  selectRange,
  resetEvent,
  resetEvents,
} = slice.actions;

// ----------------------------------------------------------------------

export function getEvents(date, customer, contact) {
  return async (dispatch) => {
    dispatch(resetEvents());
    dispatch(slice.actions.startLoading());
    try {
      const params= {
        isArchived: false,
        isActive: true,
        customer,
        contact
      }
      if(date){
        params.month = (Number(date?.getMonth())+1)
        params.year = date?.getFullYear()
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}calender/events`, { params } );
      const formattedData = response?.data?.map((v) => ({
        id: v?._id,
        title: `${v?.createdBy?.name || ''}, ${v?.customer?.name || ''}`,
        date: v?.start,
        textColor: "#1890FF",
        extendedProps: {
          ...v
        }
      }));
      dispatch(slice.actions.getEventsSuccess(formattedData));
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
      
      if (params?.date && !params?.allDay) {
        const eventDate = new Date(params.date);

        const startTime = params.start ? new Date(params.start) : null;
        if (startTime) {
          startTime.setFullYear(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        }

        const endTime = params.end ? new Date(params.end) : null;
        if (endTime) {
          endTime.setFullYear(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        }

        if (startTime && endTime && startTime > endTime) {
          // Add a day to endTime if endTime is less than startTime
          endTime.setDate(endTime.getDate() + 1);
        }
      

        params.start = startTime;
        params.end = endTime;
      }else{
        params.start = new Date(new Date().setHours(7, 0, 0));
        params.end = new Date(new Date().setHours(18, 0, 0));
      }

      const data = {
        start: params?.start,
        end: params?.end,
        customer: params?.customer?._id || null,
        machines: params?.machines?.map((machine)=> machine?._id) || [] ,
        site: params?.site?._id || null,
        jiraTicket: params?.jiraTicket || '',
        primaryTechnician: params?.primaryTechnician?._id || '',
        supportingTechnicians: params?.supportingTechnicians?.map((el)=> el?._id) || [] ,
        notifyContacts: params?.notifyContacts?.map((el)=> el?._id) || [],
        description: params?.description || '',
      };
      
      const response = await axios.post(`${CONFIG.SERVER_URL}calender/events`, data);
      dispatch(slice.actions.createEventSuccess(response.data.Event));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
 
// ----------------------------------------------------------------------

export function updateEventDate(id, start, end) {
  return async (dispatch) => {
    try {
      const data = { start, end };
    dispatch(slice.actions.updateEventDateLocal({ id, start, end }));
      await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, data);
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

      if (params?.date && !params?.allDay) {
        const eventDate = new Date(params.date);

        const startTime = params.start ? new Date(params.start) : null;
        if (startTime) {
          startTime.setFullYear(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        }

        const endTime = params.end ? new Date(params.end) : null;
        if (endTime) {
          endTime.setFullYear(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
        }

        if (startTime && endTime && startTime > endTime) {
          // Add a day to endTime if endTime is less than startTime
          endTime.setDate(endTime.getDate() + 1);
        }

        params.start = startTime;
        params.end = endTime;
      }else{
        params.start = new Date(new Date().setHours(7, 0, 0));
        params.end = new Date(new Date().setHours(18, 0, 0));
      }

      const data = {
        start: params?.start,
        end: params?.end,
        customer: params?.customer?._id || null,
        machines: params?.machines?.map((machine)=> machine?._id) || [] ,
        site: params?.site?._id || null,
        jiraTicket: params?.jiraTicket || '',
        primaryTechnician: params?.primaryTechnician?._id || '',
        supportingTechnicians: params?.supportingTechnicians?.map((el)=> el?._id) || [] ,
        notifyContacts: params?.notifyContacts?.map((el)=> el?._id) || [],
        description: params?.description || '',
      };

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
       await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, { isArchived: true, });
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
