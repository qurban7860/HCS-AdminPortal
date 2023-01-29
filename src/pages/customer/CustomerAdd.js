import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import CustomerAddForm from './CustomerAddForm';

// ----------------------------------------------------------------------

export default function CustomerAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Customer: Create a new Customer</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Customer"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Customer',
              href: PATH_DASHBOARD.customer.list,
            },
            { name: 'New Customer' },
          ]}
        />
        <CustomerAddForm />
      </Container>
    </>
  );
}
