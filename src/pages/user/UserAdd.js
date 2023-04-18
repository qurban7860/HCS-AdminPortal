import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserAddForm from '../../sections/@dashboard/user/UserNewEditForm';
import {Cover} from '../components/Cover';

// ----------------------------------------------------------------------

export default function UserAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        {/* <CustomBreadcrumbs
          heading="Create a new user"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'User',
              href: PATH_DASHBOARD.user.list,
            },
            { name: 'New user' },
          ]}
        /> */}
        <Cover/>
        <UserAddForm />
      </Container>
    </>
  );
}
