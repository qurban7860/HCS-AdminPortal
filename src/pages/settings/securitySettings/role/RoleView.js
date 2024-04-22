import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Card, Container } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// redux
import { getRole } from '../../../../redux/slices/securityUser/role';
import { getAssignedSecurityUsers } from '../../../../redux/slices/securityUser/securityUser';
// sections
import { Cover } from '../../../../components/Defaults/Cover';
import RoleViewForm from './RoleViewForm';

// ----------------------------------------------------------------------

export default function RoleView() {
  const dispatch = useDispatch();

  const { id } = useParams();
  useLayoutEffect(() => {
    dispatch(getRole(id));
    dispatch(getAssignedSecurityUsers(id));
  }, [id, dispatch]);

  const { role } = useSelector((state) => state.role);
  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name={role?.name} generalSettings />
      </Card>
      <RoleViewForm />
    </Container>
  );
}
