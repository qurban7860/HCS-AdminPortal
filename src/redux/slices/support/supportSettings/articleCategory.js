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
  articleCategories: [],
  activeArticleCategories: [],
  articleCategory: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100
};

const slice = createSlice({
  name: 'articleCategory',
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
    getArticleCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.articleCategories = action.payload;
      state.initial = true;
    },

    // GET Active Setting
    getActiveArticleCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeArticleCategories = action.payload;
      state.initial = true;
    },

    // GET Setting
    getArticleCategorySuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.articleCategory = action.payload;
      state.initial = true;
    },

    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // RESET DOCUMENT NAME
    resetArticleCategory(state) {
      state.articleCategory = {};
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
  resetArticleCategory,
  resetArticleCategories,
  resetActiveArticleCategories,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setReportHiddenColumns,
} = slice.actions;

// ----------------------------Add Document Type------------------------------------------

export function addArticleCategory(data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post(`${CONFIG.SERVER_URL}support/settings/articleCategory/`, data);
      dispatch(slice.actions.setResponseMessage('Article Category saved successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Document Type-------------------------------------

export function updateArticleCategory(Id, data) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.patch(`${CONFIG.SERVER_URL}support/settings/articleCategory/${Id}`, data);
      dispatch(slice.actions.setResponseMessage('Article Category updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Article Category-----------------------------------

export function getArticleCategories(isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/settings/articleCategory/list`,
        {
          params: {
            isArchived: isArchived || false
          }
        }
      );
      dispatch(slice.actions.getArticleCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Article Categories loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// -----------------------------------Get Active Article Category-----------------------------------

export function getActiveArticleCategories() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {

      const query = {
        params: {
          isArchived: false,
          isActive: true,
        }
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}support/settings/articleCategory/list`, query);
      dispatch(slice.actions.getActiveArticleCategoriesSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Article Categories loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      // throw error;
    }
  };
}

// -------------------------------get Article Category---------------------------------------

export function getArticleCategory(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/settings/articleCategory/${Id}`);
      dispatch(slice.actions.getArticleCategorySuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Article Category Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------archive Article Category-------------------------------------

export function archiveArticleCategory(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}support/settings/articleCategory/${Id}`,
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

export function restoreArticleCategory(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}support/settings/articleCategory/${Id}`,
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

export function deleteArticleCategory(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}support/settings/articleCategory/${Id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}