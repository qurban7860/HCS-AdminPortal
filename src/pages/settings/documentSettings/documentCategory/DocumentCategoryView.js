import {  useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import {  Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// redux

import { getDocumentCategory } from '../../../../redux/slices/document/documentCategory';

// sections
import { Cover } from '../../../../components/Defaults/Cover';
import DocumentCategoryViewForm from './DocumentCategoryViewForm';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function DocumentCategoryView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getDocumentCategory(id));
  }, [id, dispatch]);

  const { documentCategory } = useSelector((state) => state.documentCategory);
  
  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name={documentCategory?.name} isArchived={documentCategory?.isArchived} />
        </StyledCardContainer>
        <DocumentCategoryViewForm />
      </Container>
    </>
  );
}
