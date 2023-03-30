import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux

import { getSuppliers, getSupplier, setSupplierEditFormVisibility } from '../../../redux/slices/products/supplier';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import SupplierCover from './SupplierCover';
import SupplierList from './SupplierList';
import SupplierViewForm from './SupplierViewForm';
/* eslint-disable */
import SupplierEditForm from './SupplierEditForm';


SupplierViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function SupplierViewPage({editPage}) {
  const dispatch = useDispatch();

  const { id } = useParams(); 

  const { themeStretch } = useSettingsContext();

  const { supplierEditFormFlag } = useSelector((state) => state.supplier);

  const { supplierEditFormVisibility } = useSelector((state) => state.supplier);
  
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<SupplierViewForm/>);

  const [supplierFlag, setSupplierFlag] = useState(true);
  const {suppliers} = useSelector((state) => state.supplier);
  const supplier = suppliers
  

  useLayoutEffect(() => {
    dispatch(setSupplierEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);


  
  useEffect(() => {
    if(supplierEditFormFlag){
      setCurrentComponent(<SupplierEditForm/>);
    }else{
      setSupplierFlag(false);
      setCurrentComponent(<SupplierViewForm/>);        
    }
  }, [editPage, supplierEditFormFlag, supplier]);
  // console.log( "muzna")
  return (
    <>
      <Helmet>
        <title> Supplier List: Detail | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        

        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            mt: '24px',
          }}
        >
          <SupplierCover name={supplier?.name} /> 
        </Card>
        
        <SupplierViewForm/>
      </Container>
    </>
  );
}
