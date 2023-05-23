import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import ContactAddForm from './ContactAddForm';

// ----------------------------------------------------------------------

export default function ContactAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <Container maxWidth={themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new Contact"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          {
            name: 'Contact',
            href: PATH_DASHBOARD.contact.list,
          },
          { name: 'New Contact' },
        ]}
      />
      <ContactAddForm />
    </Container>
  );
}
