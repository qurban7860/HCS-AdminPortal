import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
import { _userList } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserAddForm from './UserAddForm';

// ----------------------------------------------------------------------

export default function UserEdit() {
  const { themeStretch } = useSettingsContext();

  const { name } = useParams();

  const currentUser = _userList.find((user) => paramCase(user.name) === name);

  return (
    <>
      <Helmet>
        <title> User: Edit user | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit user"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'User',
              href: PATH_DASHBOARD.user.list,
            },
            { name: currentUser?.name },
          ]}
        />

        <UserAddForm isEdit currentUser={currentUser} />
      </Container>
    </>
  );
}
