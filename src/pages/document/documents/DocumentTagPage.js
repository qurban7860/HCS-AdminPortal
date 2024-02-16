import { useEffect, memo } from 'react';

import PropTypes from 'prop-types';
// @mui
import { useDispatch, useSelector } from 'react-redux';
import {
  setDocumentFormVisibility,
  setDocumentListFormVisibility,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentGalleryVisibility,
} from '../../../redux/slices/document/document';
// components
import DocumentList from './DocumentList';
import DocumentAddForm from './DocumentAddForm';
import DocumentListAddForm from './DocumentListAddForm';
import DocumentViewForm from './DocumentViewForm';
import DocumentEditForm from './DocumentEditForm';
import DocumentHistoryViewForm from './DocumentHistoryViewForm';
import DocumentGallery from './DocumentGallery';
/* eslint-disable */

// ----------------------------------------------------------------------
DocumentTagPage.propTypes = {
  Page: PropTypes.bool,
};
function DocumentTagPage(Page) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDocumentFormVisibility(false));
    dispatch(setDocumentListFormVisibility(false));
    dispatch(setDocumentEditFormVisibility(false));
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentGalleryVisibility(false));
  }, [Page?.customerPage, Page?.machinePage]);

  const {
    documents,
    documentFormVisibility,
    documentListFormVisibility,
    documentEditFormVisibility,
    documentViewFormVisibility,
    documentHistoryViewFormVisibility,
    documentGalleryVisibility,
  } = useSelector((state) => state.document);

  const handleFormVisibility = () => {
    dispatch(setDocumentFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentGalleryVisibility(false));
  };
  
  const handleListFormVisibility = () => {
    dispatch(setDocumentFormVisibility(false));
    dispatch(setDocumentListFormVisibility(true));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentGalleryVisibility(false));
  };

  const handleEditFormVisibility = () => {
    dispatch(setDocumentEditFormVisibility(true));
  };

  return (
    <>
      { !documentFormVisibility &&
        !documentEditFormVisibility &&
        !documentViewFormVisibility &&
        !documentHistoryViewFormVisibility &&
        !documentGalleryVisibility && (
          <DocumentList customerPage={Page?.customerPage} machinePage={Page?.machinePage} />
      )}

      { documentGalleryVisibility &&
        !documentFormVisibility &&
        !documentEditFormVisibility &&
        !documentViewFormVisibility &&
        !documentHistoryViewFormVisibility && (
          <DocumentGallery customerPage={Page?.customerPage} machinePage={Page?.machinePage} />
      )}

      { documentFormVisibility &&
        !documentEditFormVisibility &&
        !documentViewFormVisibility &&
        !documentHistoryViewFormVisibility && (
          <DocumentAddForm
            customerPage={Page?.customerPage}
            machinePage={Page?.machinePage}
            handleFormVisibility={handleFormVisibility}
          />
        )}

        { documentListFormVisibility &&
        !documentFormVisibility &&
        !documentEditFormVisibility &&
        !documentViewFormVisibility &&
        !documentHistoryViewFormVisibility && (
          <DocumentListAddForm
            customerPage={Page?.customerPage}
            machinePage={Page?.machinePage}
            handleFormVisibility={handleListFormVisibility}
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