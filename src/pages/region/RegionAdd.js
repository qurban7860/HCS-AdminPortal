// @mui
import { Container, Card } from '@mui/material';
// sections
import RegionAddForm from './RegionAddForm';
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
        <Cover name="Create Region" icon="mdi:user-circle" />
      </Card>
      <RegionAddForm />
    </Container>
  );
}
