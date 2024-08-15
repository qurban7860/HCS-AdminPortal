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
        title: `${action.payload?.primaryTechnician?.firstName || ''} ${action.payload?.primaryTechnician?.lastName || ''}, ${action.payload?.customer?.name || ''}`,
        start: action.payload?.start,
        end: action.payload?.end,
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
            title: `${action.payload?.primaryTechnician?.firstName || ''} ${action.payload?.primaryTechnician?.lastName || ''}, ${action.payload?.customer?.name || ''}`,
            start: action.payload?.start,
            end: action.payload?.end,
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
            start,
            end,
            extendedProps: { ...event.extendedProps, start, end }
          };
          
        }
        return event;
      });
    },

    // DELETE EVENTS
    deleteEventSuccess(state, action) {
      const eventId = action.payload._id;
      state.events = state.events.filter((event) => event.id !== eventId);
    },

    // SELECT RANGE
    selectRange(state, action) {
      const { start, end } = action.payload;
      const endDate = new Date(end);
      endDate.setDate(end.getDate() - 1);
      state.selectedEvent = null;
      state.selectedRange = { start, end: endDate };
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
        title: `${v?.primaryTechnician?.firstName || ''} ${v?.primaryTechnician?.lastName || ''}, ${v?.customer?.name || ''}`,
        start: v?.start,
        end: v?.end,
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
      
      const data = {
        isCustomerEvent: params?.isCustomerEvent,
        start: params?.start_date,
        end: params?.end_date,
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
      const data = {
        isCustomerEvent: params?.isCustomerEvent,
        start: params?.start_date,
        end: params?.end_date,
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
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, { isArchived: true, });
      await dispatch(slice.actions.deleteEventSuccess(response.data.Event));
      } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
