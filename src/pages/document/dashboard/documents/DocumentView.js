import { Helmet } from 'react-helmet-async';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// redux

import { getDocumentCategory } from '../../../../redux/slices/document/documentCategory';
// sections
import { Cover } from '../../../components/Cover';
import DocumentViewForm from './DocumentViewForm';
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
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <Cover name={documentCategory?.name} />
        </Card>
        <DocumentViewForm />
      </Container>
    </>
  );
}
