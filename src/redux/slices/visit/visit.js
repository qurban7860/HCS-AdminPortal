import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';
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
      const newEvent = action.payload;
      state.isLoading = false;
      state.visits = [...state.visits, newEvent];
    },

    // UPDATE VISIT
    updateVisitSuccess(state, action) {
      state.isLoading = false;
      state.visits = state.visits.map((event) => {
        if (event.id === action.payload.id) {
          return action.payload;
        }
        return event;
      });
    },

    // DELETE VISITS
    deleteVisitSuccess(state, action) {
      const eventId = action.payload;
      state.visits = state.visits.filter((event) => event.id !== eventId);
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
  resetVisits,
} = slice.actions;

// ----------------------------------------------------------------------

export function getVisits() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}calender/visits`, {
        params: {
          isArchived: false,
          isActive: true
        }
      });
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

export function newVisit(newEvent) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post(`${CONFIG.SERVER_URL}calender/visits`, newEvent);
      dispatch(slice.actions.createVisitSuccess(response.data));
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
        visitDate: date,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/visits/${id}`, data);
      dispatch(slice.actions.updateVisitSuccess(response.data));
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
      const data = {
        visitDate: params.visitDate,
      };
      const response = await axios.patch(`${CONFIG.SERVER_URL}calender/visits/${id}`, data);
      dispatch(slice.actions.updateVisitSuccess(response.data));
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
      await axios.patch(`${CONFIG.SERVER_URL}calender/visits/${id}`, { 
        isArchived: true, 
       });
    } catch (error) {
      dispatch(slice.actions.hasError(error?.Message));
      throw error;
    }
  };
}
