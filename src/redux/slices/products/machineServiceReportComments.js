/* eslint-disable import/no-extraneous-dependencies */
import { createSlice } from '@reduxjs/toolkit';
import { fetchEventSource } from '@microsoft/fetch-event-source';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  initial: false,
  // noteFormVisibility: false,
  // noteViewFormVisibility: false,
  // noteEditFormVisibility: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  comment: {},
  comments: [],
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
};

const slice = createSlice({
  name: 'serviceReportComments',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // // SET ADD FORM TOGGLE
    // setNoteFormVisibility(state, action){
    //   state.noteFormVisibility = action.payload;
    // },

    // // SET EDIT FORM TOGGLE
    // setNoteEditFormVisibility(state, action){
    //   state.noteEditFormVisibility = action.payload;
    // },

    // // SET VIEW TOGGLE
    // setNoteViewFormVisibility(state, action){
    //   state.noteViewFormVisibility = action.payload;
    // },

    // HAS ERROR
    updateCommentsFromSSE(state, action) {
      state.comments = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
      state.initial = true;
    },

    // GET  Comments
    getCommentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.comments = action.payload;
      state.initial = true;
      // state.responseMessage = 'Comments loaded successfully';
    },

    // ADD  Comments
    addCommentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.comments = action.payload;
      state.initial = true;
      state.responseMessage = 'Comment saved successfully';
    },
    // UPDATE  Comments
    updateCommentsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.comments = action.payload;
      state.initial = true;
      state.responseMessage = 'Comment updated successfully';
    },

    // GET Comment
    // getCommentSuccess(state, action) {
    //   state.isLoading = false;
    //   state.success = true;
    //   state.comment = action.payload;
    //   state.initial = true;
    // },
    // DELETE Comment
    deleteCommentSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.comments = action.payload;
      state.initial = true;
      state.responseMessage = 'Comment deleted successfully';
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET LICENSE
    resetComment(state) {
      state.comment = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET LICENSE
    resetComments(state) {
      state.comments = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },
    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
    ChangePage(state, action) {
      state.page = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  // setNoteFormVisibility,
  // setNoteEditFormVisibility,
  // setNoteViewFormVisibility,
  updateCommentsFromSSE,
  resetComment,
  resetComments,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
} = slice.actions;

// ----------------------------------------------------------------------

export function connectToCommentsSSE(serviceReportId) {
  return async (dispatch) => {
    const token = window.localStorage.getItem('accessToken');
    
    const ctrl = new AbortController();

    fetchEventSource(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/serviceReportComments/stream`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      signal: ctrl.signal,
      onmessage(event) {
        const comments = JSON.parse(event.data);
        dispatch(slice.actions.updateCommentsFromSSE(comments));
      },
      onerror(error) {
        // console.error('SSE Error:', error);
        ctrl.abort();
      },
    });

    return ctrl;
  };
}

export function getComments({serviceReportId}) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/serviceReportComments`);
      dispatch(slice.actions.getCommentsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function addComment({serviceReportId, params}) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = { ...params};
      const response = await axios.post(`${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/serviceReportComments/`, data);
      // dispatch(slice.actions.setNoteFormVisibility(false));
      dispatch(slice.actions.addCommentsSuccess(response.data?.commentsList));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function updateComment(serviceReportId, commentId, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        comment: params.comment,
        isActive: true,
        isArchived: false,
      };
      const response = await axios.patch(
        `${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/serviceReportComments/${commentId}`,
        data
      );
      dispatch(slice.actions.updateCommentsSuccess(response.data?.commentsList));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// export function getComment(serviceReportId, commentId) {
//   return async (dispatch) => {
//     dispatch(slice.actions.startLoading());
//     try {
//       const response = await axios.get(
//         `${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/serviceReportComments/${commentId}`
//       );
//       dispatch(slice.actions.getCommentSuccess(response.data));
//     } catch (error) {
//       console.error(error);
//       dispatch(slice.actions.hasError(error.Message));
//       throw error;
//     }
//   };
// }

export function deleteComment(serviceReportId, commentId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(
        `${CONFIG.SERVER_URL}products/serviceReport/${serviceReportId}/serviceReportComments/${commentId}`);
      dispatch(slice.actions.deleteCommentSuccess(response.data?.commentsList));
      // dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
