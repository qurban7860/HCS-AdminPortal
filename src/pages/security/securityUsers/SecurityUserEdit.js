// @mui
import { Container, Card } from '@mui/material';
// redux
import UserEditForm from './SecurityUserEditForm';
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function SecurityUserEdit() {

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Edit User"/>
      </StyledCardContainer>
      <UserEditForm />
    </Container>
  );
}
