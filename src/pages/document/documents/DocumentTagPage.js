import { Helmet } from 'react-helmet-async';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { getDocumentCategory } from '../../../redux/slices/document/documentCategory';
  import {
    setDocumentFormVisibility,
    setDocumentEditFormVisibility,
    setDocumentViewFormVisibility,
    setDocumentHistoryViewFormVisibility
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
export default function DocumentTagPage(Page) {
    const dispatch = useDispatch();
      useEffect(() => {
        dispatch(setDocumentFormVisibility(false))
        dispatch(setDocumentEditFormVisibility(false))
        dispatch(setDocumentViewFormVisibility(false))
        dispatch(setDocumentHistoryViewFormVisibility(false))
      },[Page?.customerPage, Page?.machinePage])
      
      const {
        documents,
        documentFormVisibility,
        documentEditFormVisibility,
        documentViewFormVisibility,
        documentHistoryViewFormVisibility,
      } = useSelector((state) => state.document);
      
      const handleFormVisibility = () => {dispatch(setDocumentFormVisibility(false))}
      const handleEditFormVisibility = () => {dispatch(setDocumentEditFormVisibility(true))}


  return (
    <>
        { !documentFormVisibility && !documentEditFormVisibility && !documentViewFormVisibility && !documentHistoryViewFormVisibility && <DocumentList customerPage={Page?.customerPage} machinePage={Page?.machinePage} /> }
        { documentFormVisibility && !documentEditFormVisibility && !documentViewFormVisibility && !documentHistoryViewFormVisibility && <DocumentAddForm customerPage={Page?.customerPage} machinePage={Page?.machinePage} handleFormVisibility={handleFormVisibility} /> }
        { !documentFormVisibility && documentEditFormVisibility && !documentViewFormVisibility && !documentHistoryViewFormVisibility && <DocumentEditForm customerPage={Page?.customerPage} machinePage={Page?.machinePage} /> }
        { !documentFormVisibility && !documentEditFormVisibility && documentViewFormVisibility && !documentHistoryViewFormVisibility && <DocumentViewForm customerPage={Page?.customerPage} machinePage={Page?.machinePage} handleEditFormVisibility={handleEditFormVisibility} /> }
        { !documentFormVisibility && !documentEditFormVisibility && !documentViewFormVisibility && documentHistoryViewFormVisibility && <DocumentHistoryViewForm customerPage={Page?.customerPage} machinePage={Page?.machinePage} /> }

    </>
  );
}
