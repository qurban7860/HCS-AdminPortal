import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../../utils/axios';
import { CONFIG } from '../../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  responseMessage: null,
  success: false,
  isLoading: false,
  error: null,
  articles: [],
  activeArticles: [],
  article: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100
};

const slice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },
    
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // GET Setting
    getArticlesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.articles = action.payload;
      state.initial = true;
    },

    // GET Active Setting
    getActiveArticlesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeArticles = action.payload;
      state.initial = true;
    },

    // GET Setting
    getArticleSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.article = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET DOCUMENT NAME
    resetArticle(state) {
      state.article = {};
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET DOCUMENT NAME
    resetArticles(state) {
      state.articles = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET Active DOCUMENT NAME
    resetActiveArticles(state) {
      state.activeArticles = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
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
    setReportHiddenColumns(state, action) {
      state.reportHiddenColumns = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  resetArticle,
  resetArticles,
  resetActiveArticles,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns,
} = slice.actions;

// ----------------------------Add Document Type------------------------------------------

export function addArticle(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        serialNumber: params.serialNumber,
        title: params.title,
        description: params.description,
        category: params.category?._id,
        isActive: params.isActive,
      }
      await axios.post(`${CONFIG.SERVER_URL}support/knowledgeBase/article/`, data);
      dispatch(slice.actions.setResponseMessage('Knowledge Base saved successfully'));
      dispatch(getArticles());
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Document Type-------------------------------------

export function updateArticle(Id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        serialNumber: params.serialNumber,
        title: params.title,
        description: params.description,
        category: params.category?._id,
        isActive: params.isActive,
      }
      await axios.patch(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${Id}`, data,);
      dispatch(slice.actions.setResponseMessage('Knowledge Base updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Knowledge Base-----------------------------------

export function getArticles(isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/knowledgeBase/article/list`,
        {
          params: {
            isArchived: isArchived || false
          }
        }
      );
      dispatch(slice.actions.getArticlesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Knowledge Bases loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// -----------------------------------Get Active Knowledge Base-----------------------------------

export function getActiveArticles() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const query = {
        params: {
          isArchived: false,
          isActive: true,
        }
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}support/knowledgeBase/article/list`, query);
      dispatch(slice.actions.getActiveArticlesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Knowledge Bases loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      // throw error;
    }
  };
}

// -------------------------------get Knowledge Base---------------------------------------

export function getArticle(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${Id}`);
      dispatch(slice.actions.getArticleSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Knowledge Base Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------archive Knowledge Base-------------------------------------

export function archiveArticle(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${Id}`,
        {
          isArchived: true,
        });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function restoreArticle(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${Id}`,
        {
          isArchived: false,
        });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteArticle(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${Id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}