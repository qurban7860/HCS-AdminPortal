import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import NoteAddForm from './NoteAddForm';

// ----------------------------------------------------------------------

export default function NoteAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        {/* <CustomBreadcrumbs
          heading="Create a new Note"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Note',
              href: PATH_DASHBOARD.customer.list,
            },
            { name: 'New Note' },
          ]}
        /> */}
        <NoteAddForm />
      </Container>
    </>
  );
}
