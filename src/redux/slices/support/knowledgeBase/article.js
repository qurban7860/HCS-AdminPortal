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
  isLoadingArticleFile: false,
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
    
    // START LOADING File
    setLoadingFile( state, action ) {
      state.isLoadingArticleFile = action.payload;;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.isLoadingArticleFile = false;
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
    
    // GET Article File
    getArticleFileSuccess(state, action) {
      const { id, data } = action.payload;
      const fArray = state.article.files;
      if (Array.isArray(fArray) && fArray.length > 0) {
        const fIndex = fArray.findIndex(f => f?._id === id);
        if ( fIndex !== -1) {
          const uFile = { ...fArray[fIndex], src: data };
          state.article = { ...state.article,
            files: [ ...fArray.slice(0, fIndex), uFile, ...fArray.slice(fIndex + 1) ],
          };
        }
      }
      state.isLoadingArticleFile = false;
    },


    addArticleFilesSuccess(state, action) {
      state.article = {
        ...state.article,
        files: [ ...( state.article?.files || [] ), ...( action.payload || [] ) ]
      }
      state.isLoadingArticleFile = false;
    },
    
    deleteArticleFileSuccess(state, action) {
      const { id } = action.payload;
      const array = state.article.files;
      if (Array.isArray(array) && array?.length > 0 ) {
        state.article = {
          ...state.article,
          files: state.article?.files?.filter( f => f?._id !== id ) || []
        };
      }
      state.isLoadingArticleFile = false;
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

// ----------------------------Add Article------------------------------------------

export function addArticle(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const formData = new FormData();
      formData.append('articleNo', params?.articleNo || '');
      formData.append('title', params?.title || '');
      formData.append('description', params?.description || '');
      formData.append('category', params?.category?._id || null);
      formData.append('customerAccess', params?.customerAccess );
      formData.append('isActive', params?.isActive );
      
      (params?.files || []).forEach((file, index) => {
        formData.append(`images`, file);
      });

      const response = await axios.post(`${CONFIG.SERVER_URL}support/knowledgeBase/article/`, formData);
      dispatch(slice.actions.setResponseMessage('Article saved successfully'));
      dispatch(getArticles());
      return response?.data;
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Article-------------------------------------

export function updateArticle(Id, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const data = {
        articleNo: params.articleNo,
        title: params.title,
        description: params.description,
        category: params.category?._id,
        customerAccess: params.customerAccess,
        isActive: params.isActive,
      }
      await axios.patch(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${Id}`, data,);
      dispatch(slice.actions.setResponseMessage('Article updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------Update Article Status-------------------------------------
export function updateArticleStatus(Id, params) {
  return async (dispatch) => {
    try {
      const data = {
        status: params.status
      }
      await axios.patch(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${Id}`, data,);
      dispatch(slice.actions.setResponseMessage('Article status updated successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// -----------------------------------Get Article-----------------------------------

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
      dispatch(slice.actions.setResponseMessage('Articles loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// -----------------------------------Get Active Article-----------------------------------

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
      dispatch(slice.actions.setResponseMessage('Articles loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      // throw error;
    }
  };
}

// -------------------------------get Article---------------------------------------

export function getArticle(Id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${Id}`);
      dispatch(slice.actions.getArticleSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Article Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ---------------------------------archive Article-------------------------------------

export function archiveArticle(Id) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
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
    // dispatch(slice.actions.startLoading());
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
    // dispatch(slice.actions.startLoading());
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

// FILES
export function getFile( id, fileId ) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${id}/files/${fileId}`);
      dispatch(slice.actions.getArticleFileSuccess({ id: fileId, data: response.data } ));
      return response;
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function addFiles( id, params ) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      const formData = new FormData();
      (params?.files || []).forEach((file, index) => {
        formData.append(`images`, file);
      });
      const response = await axios.post(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${id}/files/`, formData);
      dispatch(slice.actions.addArticleFilesSuccess( response.data ));
      return response;
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function deleteFile( id, fileId ) {
  return async (dispatch) => {
    dispatch(slice.actions.setLoadingFile(true));
    try {
      await axios.delete(`${CONFIG.SERVER_URL}support/knowledgeBase/article/${id}/files/${fileId}`);
      dispatch(slice.actions.deleteArticleFileSuccess( { id: fileId } ));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}
