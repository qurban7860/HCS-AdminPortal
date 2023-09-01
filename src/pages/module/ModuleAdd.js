// @mui
import { Container, Card } from '@mui/material';
// sections
import ModuleAddForm from './ModuleAddForm';
import { Cover } from '../components/Defaults/Cover';
// ----------------------------------------------------------------------

export default function ModuleAdd() {
  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name="Create Module" icon="mdi:user-circle" />
      </Card>
      <ModuleAddForm />
    </Container>
  );
}
