import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_MACHINE, PATH_SETTING } from '../../../routes/paths';
// redux
import { getMachineServiceParam } from '../../../redux/slices/products/machineServiceParams';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components
import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { Cover } from '../../components/Defaults/Cover';
import MachineServiceParamViewForm from './MachineServiceParamViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function MachineServiceParamView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getMachineServiceParam(id));
  }, [id, dispatch]);

  const { machineServiceParam } = useSelector((state) => state.machineServiceParam);

  return (
    <>
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover
            name={machineServiceParam?.name}
            setting
            backLink={PATH_MACHINE.machines.settings.machineServiceParams.list}
          />
        </Card>
        <MachineServiceParamViewForm />
      </Container>
    </>
  );
}
