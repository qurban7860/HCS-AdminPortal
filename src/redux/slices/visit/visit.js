import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';
import { fDate, fTimestamp } from '../../../utils/formatTime';
// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  visit: {},
  visits: [],
  openModal: false,
  selectedEventId: null,
  selectedRange: null,
};

const slice = createSlice({
  name: 'visit',
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

    // GET VISITS
    getVisitsSuccess(state, action) {
      state.isLoading = false;
      state.visits = action.payload;
    },

    // GET VISIT
    getVisitSuccess(state, action) {
      state.isLoading = false;
      state.visit = action.payload;
    },

    // CREATE VISIT
    createVisitSuccess(state, action) {
      const newEvent = action?.payload;
      state.isLoading = false;
      state.visits = [...state.visits, newEvent];
    },

    // UPDATE VISIT
    updateVisitSuccess(state, action) {
      state.isLoading = false;
      state.visits = state.visits.map((event) => {
        if (event._id === action.payload._id) {
          return action.payload;
        }
        return event;
      });
    },
    // UPDATE VISIT
    updateVisitDateLocal(state, action) {
      state.visits = action.payload
    },

    // DELETE VISITS
    deleteVisitSuccess(state, action) {
      const eventId = action.payload;
      state.visits = state.visits.filter((event) => event._id !== eventId);
    },

    // SELECT VISITS
    selectVisit(state, action) {
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
    // RESET VISIS
    resetVisits(state) {
      state.visits = [];
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { 
  onOpenModal, 
  onCloseModal, 
  selectVisit, 
  selectRange,
  updateVisitDateLocal,
  resetVisits,
} = slice.actions;

// ----------------------------------------------------------------------

export function getVisits(date, customer) {
  return async (dispatch) => {
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
      const response = await axios.get(`${CONFIG.SERVER_URL}calender/visits`, { params } );
      dispatch(slice.actions.getVisitsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

export function getVisit(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}calender/visits/${id}`);
      dispatch(slice.actions.getVisitSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function newVisit(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const newStartDate = new Date(params?.start )
      const newDate = new Date(params?.visitDate); 
      newDate.setHours(newStartDate.getHours(), newStartDate.getMinutes(), newStartDate.getSeconds(), newStartDate.getMilliseconds());
      const data = {
        visitDate: newDate || null,
        start: params?.start,
        end: params?.end,
        customer: params?.customer?._id || null,
        machine: params?.machine?._id || null,
        site: params?.site?._id || null,
        jiraTicket: params?.jiraTicket || '',
        primaryTechnician: params?.primaryTechnician?._id || '',
        supportingTechnicians: params?.supportingTechnicians?.map((el)=> el?._id) || [] ,
        notifyContacts: params?.notifyContacts?.map((el)=> el?._id) || [],
        purposeOfVisit: params?.purposeOfVisit || '',
      };
      
      if(params?.allDay){
        data.start = new Date(new Date().setHours(7, 0, 0));
        data.end = new Date(new Date().setHours(18, 0, 0));
      }
      const response = await axios.post(`${CONFIG.SERVER_URL}calender/visits`, data);
      dispatch(slice.actions.createVisitSuccess(response.data.Visit));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
 
// ----------------------------------------------------------------------

export function updateVisitDate(id, date) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        visitDate:  date,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/visits/${id}`, data);
      // dispatch(slice.actions.updateVisitSuccess(response?.data?.Visit));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

export function updateVisit(id, params) {
  
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const newStartDate = new Date(params?.start )
      const newDate = new Date(params?.visitDate); 
      newDate.setHours(newStartDate.getHours(), newStartDate.getMinutes(), newStartDate.getSeconds(), newStartDate.getMilliseconds());
      const data = {
        visitDate: newDate || null,
        start: params?.start,
        end: params?.end,
        customer: params?.customer?._id || null,
        machine: params?.machine?._id || null,
        site: params?.site?._id || null,
        jiraTicket: params?.jiraTicket || '',
        primaryTechnician: params?.primaryTechnician?._id || '',
        supportingTechnicians: params?.supportingTechnicians?.map((el)=> el?._id) || [] ,
        notifyContacts: params?.notifyContacts?.map((el)=> el?._id) || [],
        purposeOfVisit: params?.purposeOfVisit || '',
      };

      if(params?.allDay){
        data.start = new Date(new Date().setHours(7, 0, 0));
        data.end = new Date(new Date().setHours(18, 0, 0));
      }

      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/visits/${id}`, data);
      dispatch(slice.actions.updateVisitSuccess(response.data.Visit));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteVisit(id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/visits/${id}`, { 
        isArchived: true, 
       });
      //  dispatch(slice.actions.deleteVisitSuccess(response.data.Visit));
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
