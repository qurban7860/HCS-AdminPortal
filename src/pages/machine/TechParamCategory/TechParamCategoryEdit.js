import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import {  getTechparamcategory } from '../../../redux/slices/products/machineTechParamCategory';
import TechParamCategoryEditForm from './TechParamCategoryEditForm';

// ----------------------------------------------------------------------

export default function TechParamCategoryEdit() {

  const dispatch = useDispatch();

  const { id } = useParams(); 

  useLayoutEffect(() => {
     dispatch(getTechparamcategory(id));
  }, [dispatch, id]);

  return (
      <Container maxWidth={ false}>
        <TechParamCategoryEditForm/>
      </Container>
  );
}
