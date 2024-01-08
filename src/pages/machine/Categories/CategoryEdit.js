import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import {  getCategory } from '../../../redux/slices/products/category';
import CategoryEditForm from './CategoryEditForm';

// ----------------------------------------------------------------------

export default function CategoryEdit() {
  useSelector((state) => state.category);

  const dispatch = useDispatch();
  const { id } = useParams(); 

  useLayoutEffect(() => {
    dispatch(getCategory(id));
  }, [dispatch, id]);
  
  return (
      <Container maxWidth={false }>
        <CategoryEditForm/>
      </Container>
  );
}
