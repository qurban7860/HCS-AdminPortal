import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// redux

import { getCategory, getCategories, setEditFormVisibility } from '../../../redux/slices/products/category';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections

import CategoryList from './CategoryList';
import CategoryViewForm from './CategoryViewForm';
import { Cover } from '../../components/Cover';
import CategoryEditForm from './CategoryEditForm';
/* eslint-disable */



CategoryView.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function CategoryView({editPage}) {
  const dispatch = useDispatch();

  const { id } = useParams(); 

  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const { editFormVisibility } = useSelector((state) => state.category);
  
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<CategoryViewForm/>);

  const [categoryFlag, setCategoryFlag] = useState(true);
  const {category} = useSelector((state) => state.category);
  
  
  useLayoutEffect(() => {
    dispatch(setEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

  useEffect(() => {
    if(editFormVisibility){
      setCurrentComponent(<CategoryEditForm/>);
    }else{
      setCategoryFlag(false);
      setCurrentComponent(<CategoryViewForm/>);        
    }
  }, [editPage, editFormVisibility, category]);

  // const clickback = () => { navigate(PATH_MACHINE.categories.list); };
  
  function handleBackClick() {
    navigate(PATH_MACHINE.categories.list);
    // Add code here to handle the click event
  }
  return (
    <>
      {/* <Helmet>
        <title> Categories List: Detail | Machine ERP</title>
      </Helmet> */}
      <Container maxWidth={false }>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }} >
          <Cover name={category?.name} setting="setting" backLink={PATH_MACHINE.categories.list}/>
        </Card>
        <CategoryViewForm/>
      </Container>
    </>
  );
}
