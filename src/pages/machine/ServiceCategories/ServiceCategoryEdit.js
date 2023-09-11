import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import ServiceCategoryEditForm from './ServiceCategoryEditForm';
// redux

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections


export default function ServiceCategoryEdit() {
  return (
    <>
      <Container maxWidth={false }>
        <ServiceCategoryEditForm/>
      </Container>
    </>
  );
}
