import { Helmet } from 'react-helmet-async';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// redux
import { getDocumentCategory } from '../../../../redux/slices/document/documentCategory';
// components
import DocumentViewForm from './DocumentViewForm';
import DocumentCover from '../../../components/DocumentForms/DocumentCover';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function DocumentView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getDocumentCategory(id));
  }, [id, dispatch]);

  const { documentCategory } = useSelector((state) => state.documentCategory);
  return (
    <>
      <Container maxWidth={false}>
        <DocumentCover content={documentCategory?.name} />
        <DocumentViewForm />
      </Container>
    </>
  );
}
