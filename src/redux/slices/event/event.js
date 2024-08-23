import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
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

    // DELETE EVENTS FILES
    deleteEventsFileSuccess(state, action) {
      const { eventId, _id } = action.payload;
      state.events = state.events.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            extendedProps: {
              ...event.extendedProps,
              files: event?.extendedProps?.files?.filter(file => file._id !== _id),
            },
          };
        }
        return event;
      });
    },

    // // DELETE EVENT FILES
    deleteEventFileSuccess(state, action) {
      const selectedEventClone = _.cloneDeep(state.selectedEvent);
      selectedEventClone.extendedProps.files = selectedEventClone.extendedProps.files?.filter(file => file._id !== action.payload?._id);
      state.selectedEvent = selectedEventClone;
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
      
      const formData = new FormData();

      formData.append('isCustomerEvent', params?.isCustomerEvent);
      formData.append('jiraTicket', params?.jiraTicket || '');
      formData.append('start', params?.start_date);
      formData.append('end', params?.end_date);
      if( params?.priority){ 
        formData.append('priority', params?.priority );
      }
      formData.append('customer', params?.customer?._id || null);
      if( params?.site?._id ){ 
        formData.append('site', params?.site?._id || null);
      }
      if( params?.primaryTechnician?._id ){ 
        formData.append('primaryTechnician', params?.primaryTechnician?._id || '')
      };
      formData.append('description', params?.description || '');
      
      (params?.machines || []).forEach((machine, index) => {
          formData.append(`machines[]`, machine?._id);
      });
      
      (params?.supportingTechnicians || []).forEach((tech, index) => {
          formData.append(`supportingTechnicians[]`, tech?._id);
      });
      
      (params?.notifyContacts || []).forEach((contact, index) => {
          formData.append(`notifyContacts[]`, contact?._id);
      });
      
      (params?.files || []).forEach((file, index) => {
          formData.append(`images`, file);
      });

      const response = await axios.post(`${CONFIG.SERVER_URL}calender/events`, formData);
      await dispatch(slice.actions.createEventSuccess(response.data.Event));
      return response.data.Event;
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
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, data);
      return response.data.Event;
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
      const formData = new FormData();
      formData.append('isCustomerEvent', params?.isCustomerEvent);
      formData.append('jiraTicket', params?.jiraTicket || '');
      formData.append('start', params?.start_date);
      formData.append('end', params?.end_date);
      if( params?.priority ){ 
        formData.append('priority', params?.priority );
      }
      formData.append('customer', params?.customer?._id || null);
      if( params?.site?._id ){ 
        formData.append('site', params?.site?._id || null);
      }
      if( params?.primaryTechnician?._id ){ 
        formData.append('primaryTechnician', params?.primaryTechnician?._id || '')
      };
      formData.append('description', params?.description || '');
      
      (params?.machines || []).forEach((machine, index) => {
          formData.append(`machines[]`, machine?._id);
      });
      
      (params?.supportingTechnicians || []).forEach((tech, index) => {
          formData.append(`supportingTechnicians[]`, tech?._id);
      });
      
      (params?.notifyContacts || []).forEach((contact, index) => {
          formData.append(`notifyContacts[]`, contact?._id);
      });
      
      (params?.files || []).forEach((file, index) => {
          formData.append(`images`, file);
      });

      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/events/${id}`, formData);
      await dispatch(slice.actions.updateEventSuccess(response.data.Event));
      return response.data.Event;
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


// ----------------------------------------------------------------------

export function deleteEventFile( eventId, id ) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`${CONFIG.SERVER_URL}calender/events/${eventId}/files/${id}`, { isActive: false, isArchived: true, });
      await dispatch(slice.actions.deleteEventFileSuccess({ _id: id }));
      await dispatch(slice.actions.deleteEventsFileSuccess({ eventId, _id: id }));
      } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
