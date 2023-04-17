import { Helmet } from 'react-helmet-async';
// @mui
import { Container , Card} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserNewEditForm from '../../sections/@dashboard/user/UserNewEditForm';
import {Cover} from '../components/Cover';
// ----------------------------------------------------------------------

export default function UserCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      {/* <Helmet>
        <title> User: Create a new user | Machine ERP</title>
      </Helmet> */}

      <Container maxWidth={false}>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <Cover name="Create User" icon='mdi:user-circle'/>
        </Card>
        <UserNewEditForm />
      </Container>
    </>
  );
}
