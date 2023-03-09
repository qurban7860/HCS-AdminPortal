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

import { getMachinestatuses, setMachinestatusesEditFormVisibility } from '../../../redux/slices/statuses';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections

import StatusList from './StatusList';
import StatusViewForm from './StatusViewForm';
import { MachineCover } from '../util';
import StatusEditForm from './StatusEditForm';




StatusViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function StatusViewPage({editPage}) {
  const dispatch = useDispatch();

  const { id } = useParams(); 

  const { themeStretch } = useSettingsContext();

  const { machinestatusEditFormFlag } = useSelector((state) => state.machinestatus);

  const { machinestatusEditFormVisibility } = useSelector((state) => state.machinestatus);
  
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<StatusViewForm/>);

  const [machinestatusFlag, setMachinestatusFlag] = useState(true);
  const {machinestatus} = useSelector((state) => state.machinestatus);
  
  useLayoutEffect(() => {
    dispatch(setMachinestatusesEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

  useEffect(() => {
    if(machinestatusEditFormFlag){
      setCurrentComponent(<StatusEditForm/>);
    }else{
      setMachinestatusFlag(false);
      setCurrentComponent(<StatusViewForm/>);        
    }
  }, [editPage, machinestatusEditFormFlag, machinestatus]);

  
  return (
    <>
      <Helmet>
        <title> Machine Statuses List: Detail | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        

        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <MachineCover name={machinestatus?.name} /> 
        </Card>
        
        <StatusViewForm/>
      </Container>
    </>
  );
}
