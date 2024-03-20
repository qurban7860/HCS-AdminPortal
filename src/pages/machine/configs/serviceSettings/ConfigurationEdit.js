import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import {  getCategory } from '../../../../redux/slices/products/category';
import CategoryEditForm from './ConfigurationEditForm';
// redux

// ----------------------------------------------------------------------

export default function ConfigurationEdit() {

  const dispatch = useDispatch();

  const { id } = useParams(); 

  useSelector((state) => state.category);

  useLayoutEffect(() => {
    dispatch(getCategory(id));
  }, [dispatch, id]);
  
  return (
      <Container maxWidth={false }>
        <CategoryEditForm/>
      </Container>
  );
}
