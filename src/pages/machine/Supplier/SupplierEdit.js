import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { getSupplier } from '../../../redux/slices/products/supplier';

import SupplierEditForm from './SupplierEditForm';



// ----------------------------------------------------------------------

export default function SupplierEdit() {

  const dispatch = useDispatch();

  const { id } = useParams(); 

  useLayoutEffect(() => {
    if(id){
      dispatch(getSupplier(id));
    }
  }, [dispatch, id]);

  
  return (
      <Container maxWidth={false}>
        <SupplierEditForm/>
      </Container>
  );
}
