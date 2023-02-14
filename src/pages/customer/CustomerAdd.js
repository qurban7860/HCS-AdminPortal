import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import CustomerAddForm from './CustomerAddForm';
import CustomerDashboardNavbar from './util/CustomerDashboardNavbar';

// ----------------------------------------------------------------------

export default function CustomerAdd() {
  const { themeStretch } = useSettingsContext();

  const theme = useTheme();


  return (
    <>
      <Helmet>
        <title> Customer: Create a new Customer</title>
      </Helmet>
      

      <Container maxWidth={themeStretch ? false : 'lg'}>
      <Grid container spacing={3}>
        <CustomerDashboardNavbar/>
      </Grid>
        <CustomerAddForm />
      </Container>
    </>
  );
}
