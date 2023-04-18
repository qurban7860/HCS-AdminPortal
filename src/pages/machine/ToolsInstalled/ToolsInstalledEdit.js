import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getSetting } from '../../../redux/slices/products/machineTechParamValue';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import ToolsInstalledEditForm from './ToolsInstalledEditForm';

// ----------------------------------------------------------------------

export default function ToolsInstalledEdit() {
  // const { themeStretch } = useSettingsContext();

  // const dispatch = useDispatch();

  // const { id } = useParams();


  // useLayoutEffect(() => {
  //   dispatch(getSetting(id));
  // }, [dispatch, id]);



  return (
    <>
      <Container maxWidth={false}>
        <ToolsInstalledEditForm />
      </Container>
    </>
  );
}
