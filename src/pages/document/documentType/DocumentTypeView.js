import {  useLayoutEffect } from 'react';
import {  useParams } from 'react-router-dom';
// @mui
import {  Card,  Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import {  PATH_SETTING } from '../../../routes/paths';
// redux

import { getDocumentType } from '../../../redux/slices/document/documentType';
// sections
import { Cover } from '../../../components/Defaults/Cover';
import DocumentTypeViewForm from './DocumentTypeViewForm';


// ----------------------------------------------------------------------

export default function DocumentTypeView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getDocumentType(id));
  }, [id, dispatch]);

  const { documentType } = useSelector((state) => state.documentType);

  return (
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover
            name={documentType?.name}
            generalSettings
            backLink={PATH_SETTING.documentType.list}
          />
        </Card>

        <DocumentTypeViewForm />
      </Container>
  );
}
