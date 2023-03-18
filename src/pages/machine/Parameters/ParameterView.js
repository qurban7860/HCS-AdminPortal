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

import { getTechparams, setTechparamEditFormVisibility } from '../../../redux/slices/products/parameters';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections

import ParameterList from './ParameterList';
import ParameterViewForm from './ParameterViewForm';
import { MachineCover } from '../util';
import ParameterEditForm from './ParameterEditForm';




StatusViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function StatusViewPage({editPage}) {
  const dispatch = useDispatch();

  const { id } = useParams(); 

  const { themeStretch } = useSettingsContext();

  const { techparamEditFormFlag } = useSelector((state) => state.techparam);

  const { TechparamEditFormVisibility } = useSelector((state) => state.techparam);
  
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<ParameterViewForm/>);

  const [techparamFlag, setTechparamFlag] = useState(true);
  const {techparam} = useSelector((state) => state.techparam);
  
  useLayoutEffect(() => {
    dispatch(setTechparamEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

  useEffect(() => {
    if(techparamEditFormFlag){
      setCurrentComponent(<ParameterEditForm/>);
    }else{
      setTechparamFlag(false);
      setCurrentComponent(<ParameterViewForm/>);        
    }
  }, [editPage, techparamEditFormFlag, techparam]);

  
  return (
    <>
      <Helmet>
        <title> Machine Parameter List: Detail | Machine ERP</title>
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
          <MachineCover name={techparam?.name} /> 
        </Card>
        
        <ParameterViewForm/>
      </Container>
    </>
  );
}
