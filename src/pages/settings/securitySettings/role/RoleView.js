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
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

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
      <StyledCardContainer>
        <Cover name={role?.name} />
      </StyledCardContainer>
      <RoleViewForm />
    </Container>
  );
}
