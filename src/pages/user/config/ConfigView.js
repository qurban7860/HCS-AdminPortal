import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button, Grid, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_DASHBOARD, PATH_MACHINE, PATH_SETTING } from '../../../routes/paths';
// redux

import { getConfig } from '../../../redux/slices/securityUser/config';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { Cover } from '../../components/Defaults/Cover';
import ConfigViewForm from './ConfigViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function ConfigView() {
  const { config } = useSelector((state) => state.userConfig);
  
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getConfig(id));
  }, [id, dispatch]);

  return (
    <>
      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <Cover name="Configuration" generalSettings="enabled" backLink={PATH_SETTING.userConfig.list} />
        </Card>
        <ConfigViewForm />
      </Container>
    </>
  );
}
