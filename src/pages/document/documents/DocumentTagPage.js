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
  setDocumentGalleryVisibility,
} from '../../../redux/slices/document/document';
// components
import DocumentList from './DocumentList';
import DocumentAddForm from './DocumentAddForm';
import DocumentViewForm from './DocumentViewForm';
import DocumentEditForm from './DocumentEditForm';
import DocumentHistoryViewForm from './DocumentHistoryViewForm';
import DocumentGallery from './DocumentGallery';
import { _userGallery } from '../../../_mock/arrays';
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
    dispatch(setDocumentGalleryVisibility(false));
  }, [Page?.customerPage, Page?.machinePage]);

  const {
    documents,
    documentFormVisibility,
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