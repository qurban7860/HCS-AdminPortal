import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
import { useDispatch,useSelector } from 'react-redux';
import { getSupplier } from '../../../redux/slices/products/supplier';

import SupplierEditForm from './SupplierEditForm';
// redux

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections



// ----------------------------------------------------------------------

export default function SupplierEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  // console.log(id);


  const { supplier } = useSelector((state) => state.supplier);

  useLayoutEffect(() => {
    if(id){
      dispatch(getSupplier(id));
    }
  }, [dispatch, id]);

  
  return (
    <>
      <Container maxWidth={false}>
        <SupplierEditForm/>
      </Container>
    </>
  );
}
