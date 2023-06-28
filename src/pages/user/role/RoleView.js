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

import { getRole} from '../../../redux/slices/securityUser/role';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// components

import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import { Cover } from '../../components/Cover';
import RoleViewForm from './RoleViewForm';
/* eslint-disable */



// ----------------------------------------------------------------------

export default function RoleView() {
  const dispatch = useDispatch();

  const { id } = useParams(); 
useLayoutEffect(() => {
  dispatch(getRole(id));
},[id,dispatch])

  const { role } = useSelector((state) => state.role);
  // console.log("role : ",role)
  return (
    <>
      <Container maxWidth={false }>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover 
            name={role?.name}
            generalSettings="enabled"
            backLink={PATH_SETTING.role.list}/> 
        </Card>
        <RoleViewForm/>
      </Container>
    </>
  );
}
