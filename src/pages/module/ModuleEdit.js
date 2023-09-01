// @mui
import { Container, Card } from '@mui/material';
// sections
import ModuleEditForm from './ModuleEditForm';
import { Cover } from '../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function ModuleEdit() {

  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Edit Module" icon="mdi:user-circle" />
      </Card>
      <ModuleEditForm />
    </Container>
  );
}
