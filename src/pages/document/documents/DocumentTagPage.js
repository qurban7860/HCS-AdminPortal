import { useEffect, memo } from 'react';

import PropTypes from 'prop-types';
// @mui
import { useDispatch, useSelector } from 'react-redux';
import {
  setDocumentFormVisibility,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  setDocumentAddFilesViewFormVisibility,
} from '../../../redux/slices/document/document';
// components
import DocumentList from './DocumentList';
import DocumentAddForm from './DocumentAddForm';
import DocumentViewForm from './DocumentViewForm';
import DocumentEditForm from './DocumentEditForm';
import DocumentHistoryViewForm from './DocumentHistoryViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------
DocumentTagPage.propTypes = {
  Page: PropTypes.bool,
};
function DocumentTagPage(Page) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDocumentFormVisibility(false));
    dispatch(setDocumentEditFormVisibility(false));
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
  }, [Page?.customerPage, Page?.machinePage]);

  const {
    documents,
    documentFormVisibility,
    documentEditFormVisibility,
    documentViewFormVisibility,
    documentHistoryViewFormVisibility,
  } = useSelector((state) => state.document);

  const handleFormVisibility = () => {
    dispatch(setDocumentFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
  };
  const handleEditFormVisibility = () => {
    dispatch(setDocumentEditFormVisibility(true));
  };

  return (
    <>
      {!documentFormVisibility &&
        !documentEditFormVisibility &&
        !documentViewFormVisibility &&
        !documentHistoryViewFormVisibility && (
          <DocumentList customerPage={Page?.customerPage} machinePage={Page?.machinePage} />
        )}
      {documentFormVisibility &&
        !documentEditFormVisibility &&
        !documentViewFormVisibility &&
        !documentHistoryViewFormVisibility && (
          <DocumentAddForm
            customerPage={Page?.customerPage}
            machinePage={Page?.machinePage}
            handleFormVisibility={handleFormVisibility}
          />
        )}
      {!documentFormVisibility &&
        documentEditFormVisibility &&
        !documentViewFormVisibility &&
        !documentHistoryViewFormVisibility && (
          <DocumentEditForm customerPage={Page?.customerPage} machinePage={Page?.machinePage} />
        )}
      {!documentFormVisibility &&
        !documentEditFormVisibility &&
        documentViewFormVisibility &&
        !documentHistoryViewFormVisibility && (
          <DocumentViewForm
            customerPage={Page?.customerPage}
            machinePage={Page?.machinePage}
            handleEditFormVisibility={handleEditFormVisibility}
          />
        )}
      {!documentFormVisibility &&
        !documentEditFormVisibility &&
        !documentViewFormVisibility &&
        documentHistoryViewFormVisibility && (
          <DocumentHistoryViewForm
            customerPage={Page?.customerPage}
            machinePage={Page?.machinePage}
          />
        )}
    </>
  );
}

export default memo(DocumentTagPage)