import {  useLayoutEffect } from 'react';
import {  useParams } from 'react-router-dom';
// @mui
import {  Card,  Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import {  PATH_SETTING } from '../../../../routes/paths';
// redux

import { getDocumentType, resetDocumentType } from '../../../../redux/slices/document/documentType';
// sections
import { Cover } from '../../../../components/Defaults/Cover';
import DocumentTypeViewForm from './DocumentTypeViewForm';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';


// ----------------------------------------------------------------------

export default function DocumentTypeView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getDocumentType(id));

    return () => {
      dispatch(resetDocumentType());
    };

  }, [id, dispatch]);

  const { documentType } = useSelector((state) => state.documentType);

  return (
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={documentType?.name} generalSettings isArchived={documentType?.isArchived} />
        </StyledCardContainer>

        <DocumentTypeViewForm />
      </Container>
  );
}
