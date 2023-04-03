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

import { getTechparamcategory, getTechparamcategories, updateTechparamcategory } from '../../../redux/slices/products/machineTechParamCategory';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections

import TechParamList from './TechParamList';
import TechParamCategoryViewForm from './TechParamCategoryViewForm';
import { Cover } from '../../components/Cover';
// import ToolEditForm from './ToolEditForm';
/* eslint-disable */



TechParamCategoryViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function TechParamCategoryViewPage({editPage}) {
  const dispatch = useDispatch();

  const { id } = useParams(); 

  const { themeStretch } = useSettingsContext();

  const { techparamcategoryEditFormFlag } = useSelector((state) => state.techparamcategory);

  const { techparamcategoryEditFormVisibility } = useSelector((state) => state.techparamcategory);
  
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<TechParamCategoryViewForm/>);

  const [techparamcategoryFlag, setTechparamcategoryFlag] = useState(true);
  const {techparamcategory} = useSelector((state) => state.techparamcategory);
  // const tool = tools
  
  useLayoutEffect(() => {
    dispatch(updateTechparamcategory(editFlag));
  }, [dispatch, editFlag]);

  

  
//   useEffect(() => {
//     if(toolEditFormFlag){
//       setCurrentComponent(<ToolEditForm/>);
//     }else{
//       setToolFlag(false);
//       setCurrentComponent(<ToolViewForm/>);        
//     }
//   }, [editPage, toolEditFormFlag, tool]);
//   console.log( "muzna")
  return (
    <>
      <Helmet>
        <title> Tech param category's List: Detail | Machine ERP</title>
      </Helmet>

      <Container maxWidth={ false } >
        

        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover name={techparamcategory?.name} setting="enable" backLink={PATH_MACHINE.techParam.list} /> 
        </Card>
        
        <TechParamCategoryViewForm/>
      </Container>
    </>
  );
}
