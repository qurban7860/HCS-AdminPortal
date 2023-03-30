import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// Slice
import { setLicenseEditFormVisibility, setLicenseFormVisibility , updateLicense , saveLicenses , getLicenses , getLicense, deleteLicense } from '../../../redux/slices/products/license';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import LicenseEditForm from './LicenseEditForm';

// ----------------------------------------------------------------------

export default function LicenseEdit() {

  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams();


  useLayoutEffect(() => {
    dispatch(getLicense(id));
  }, [dispatch, id]);



  return (
    <>
      <Helmet>
        <title> Site: Edit Page | Machine ERP</title>
      </Helmet>

      <Container maxWidth={false}>
        <LicenseEditForm />
      </Container>
    </>
  );
}
