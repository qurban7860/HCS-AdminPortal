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

import { getCategory, getCategories, setCategoryEditFormVisibility } from '../../../redux/slices/products/category';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
// import SupplierCover from './SupplierCover';
import CategoryList from './CategoryList';
import CategoryViewForm from './CategoryViewForm';
import { MachineCover } from '../util';
/* eslint-disable */
// import SupplierEditForm from './SupplierEditForm';


CategoryViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function CategoryViewPage({editPage}) {
  const dispatch = useDispatch();

  const { id } = useParams(); 

  const { themeStretch } = useSettingsContext();

  const { categoryEditFormFlag } = useSelector((state) => state.category);

  const { categoryEditFormVisibility } = useSelector((state) => state.category);
  
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<CategoryViewForm/>);

  const [categoryFlag, setCategoryFlag] = useState(true);
  const {category} = useSelector((state) => state.category);
  
  
  useLayoutEffect(() => {
    dispatch(setCategoryEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

  

  
  useEffect(() => {
    if(categoryEditFormFlag){
      setCurrentComponent(<CategoryEditForm/>);
    }else{
      setCategoryFlag(false);
      setCurrentComponent(<CategoryViewForm/>);        
    }
  }, [editPage, categoryEditFormFlag, category]);
  console.log( "muzna")
  return (
    <>
      <Helmet>
        <title> Categories List: Detail | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        

        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <MachineCover name={category?.name} /> 
        </Card>
        
        <CategoryViewForm/>
      </Container>
    </>
  );
}
