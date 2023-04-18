import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
import { useLayoutEffect } from 'react';
// @mui
import { Container , Card } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUser } from '../../redux/slices/user';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import UserEditForm from '../../sections/@dashboard/user/UserEditForm';
import {Cover} from '../components/Cover';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  // console.log(id);


  const { user } = useSelector((state) => state.user);

  useLayoutEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  return (
    <>

      <Container maxWidth={false}>
        {/* <CustomBreadcrumbs
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
            { name: user?.firstName },
          ]}
        /> */}
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
          }}
        >
          <Cover name="Edit User" icon='mdi:user-circle'/>
        </Card>
        <UserEditForm />
      </Container>
    </>
  );
}
