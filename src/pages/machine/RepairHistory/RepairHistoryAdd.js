import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import SiteAddForm from './RepairHistoryAddForm';

// ----------------------------------------------------------------------

export default function RepairHistoryAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Site"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Site',
              href: PATH_DASHBOARD.customer.list,
            },
            { name: 'New Site' },
          ]}
        />
        <SiteAddForm />
      </Container>
    </>
  );
}
