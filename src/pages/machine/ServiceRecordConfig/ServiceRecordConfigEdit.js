import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch } from 'react-redux';
import { Container } from '@mui/material';
import { getServiceRecordConfig } from '../../../redux/slices/products/serviceRecordConfig';
import CategoryEditForm from './ServiceRecordConfigEditForm';
// redux

// ----------------------------------------------------------------------

export default function CategoryEdit() {
  const dispatch = useDispatch();
  const { id } = useParams(); 
  
  useLayoutEffect(() => {
    dispatch(getServiceRecordConfig(id));
  }, [dispatch, id]);

  
  return (
      <Container maxWidth={false }>
        <CategoryEditForm/>
      </Container>
  );
}
