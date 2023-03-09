import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
// routes
import { PATH_MACHINE } from 'src/routes/paths';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { getSuppliers, getSupplier, setSupplierEditFormVisibility } from 'src/redux/slices/supplier';
// auth
import { useAuthContext } from 'src/auth/useAuthContext';
// components

import Iconify from 'src/components/iconify/Iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from 'src/components/settings';
// sections
import { MachineCover } from '../util';
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
  console.log(suppliers)
  // return "wow"
  // const supplier = suppliers.find((supp)=>supp._id === id);
  // useLayoutEffect(() => {
  //   if(id != null){
  //     dispatch(getSupplier(id));
  //   }
  // }, [dispatch, id]);

  useLayoutEffect(() => {
    dispatch(setSupplierEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

 

  
  

  // useLayoutEffect(() => {
  //   dispatch(getSupplier(id));
  // }, [dispatch, id]);
  // 

  
  useEffect(() => {
    if(supplierEditFormFlag){
      setCurrentComponent(<SupplierEditForm/>);
    }else{
      setSupplierFlag(false);
      setCurrentComponent(<SupplierViewForm/>);        
    }
  }, [editPage, supplierEditFormFlag, supplier]);
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
          }}
        >
          <MachineCover name={supplier?.name} /> 
        </Card>
        <SupplierViewForm/>
      </Container>
    </>
  );
}
