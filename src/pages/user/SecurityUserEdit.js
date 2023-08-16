import { useParams } from 'react-router-dom';
// @mui
import { Container, Card } from '@mui/material';
// redux
import UserEditForm from './SecurityUserEditForm';
import { Cover } from '../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function SecurityUserEdit() {

  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Edit User" icon="mdi:user-circle" />
      </Card>
      <UserEditForm />
    </Container>
  );
}
