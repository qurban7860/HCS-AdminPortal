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

import { getMachinemodels, updateMachinemodel, setMachinemodelsEditFormVisibility } from '../../../redux/slices/products/model';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections

import ModelList from './ModelList';
import ModelViewForm from './ModelViewForm';
import { Cover } from '../../components/Cover';
import ModelEditForm from './ModelEditForm';

import LogoAvatar from '../../../components/logo-avatar/LogoAvatar';

ModelViewPage.propTypes = {
  editPage: PropTypes.bool,
};

// ----------------------------------------------------------------------

export default function ModelViewPage({editPage}) {
  const dispatch = useDispatch();

  const { id } = useParams();

  const { themeStretch } = useSettingsContext();

  const { machinemodelEditFormFlag } = useSelector((state) => state.machinemodel);

  const { machinemodelEditFormVisibility } = useSelector((state) => state.machinemodel);

  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<ModelViewForm/>);

  const [machinemodelFlag, setMachinemodelFlag] = useState(true);
  const {machinemodel} = useSelector((state) => state.machinemodel);

  useLayoutEffect(() => {
    dispatch(setMachinemodelsEditFormVisibility(editFlag));
  }, [dispatch, editFlag]);

  useEffect(() => {
    if(machinemodelEditFormFlag){
      setCurrentComponent(<ModelEditForm/>);
    }else{
      setMachinemodelFlag(false);
      setCurrentComponent(<ModelViewForm/>);
    }
  }, [editPage, machinemodelEditFormFlag, machinemodel]);


  return (
    <>
      {/* <Helmet>
        <title> Machine Models List: Detail | Machine ERP</title>
      </Helmet> */}

      <Container maxWidth={false }>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
          >
          <Cover photoURL={<LogoAvatar/>} name={machinemodel?.name} setting="enable" backLink={PATH_MACHINE.machineModel.list}/>
        </Card>
        <ModelViewForm/>
      </Container>
    </>
  );
}
