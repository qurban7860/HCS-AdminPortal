// @mui
import { Container, Card } from '@mui/material';
// sections
import SecurityUserAddForm from './SecurityUserAddForm';
import { Cover } from '../components/Defaults/Cover';
// ----------------------------------------------------------------------

export default function SecurityUserAdd() {
  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name="Create User" icon="mdi:user-circle" />
      </Card>
      <SecurityUserAddForm />
    </Container>
  );
}
