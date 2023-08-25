import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// redux

import { getRole } from '../../../redux/slices/securityUser/role';
import { getAssignedSecurityUsers } from '../../../redux/slices/securityUser/securityUser';
// sections
import { Cover } from '../../components/Defaults/Cover';
import RoleViewForm from './RoleViewForm';
/* eslint-disable */

// ----------------------------------------------------------------------

export default function RoleView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getRole(id));
    dispatch(getAssignedSecurityUsers(id));
  }, [id, dispatch]);

  const { role } = useSelector((state) => state.role);
  // console.log("role : ",role)
  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
          // mt: '24px',
        }}
      >
        <Cover name={role?.name} generalSettings="enabled" backLink={PATH_SETTING.role.list} />
      </Card>
      <RoleViewForm />
    </Container>
  );
}
