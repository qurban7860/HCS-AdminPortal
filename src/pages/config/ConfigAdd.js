// @mui
import { Container, Card } from '@mui/material';
// sections
import ConfigAddForm from './ConfigAddForm';
import { Cover } from '../components/Defaults/Cover';
// ----------------------------------------------------------------------

export default function RegionAdd() {
  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name="Create Config" icon="mdi:user-circle" />
      </Card>
      <ConfigAddForm />
    </Container>
  );
}
