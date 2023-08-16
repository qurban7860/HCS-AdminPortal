// @mui
import { Container, Card } from '@mui/material';
// sections
import RegionEditForm from './RegionEditForm';
import { Cover } from '../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function RegionEdit() {

  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Edit Region" icon="mdi:user-circle" />
      </Card>
      <RegionEditForm />
    </Container>
  );
}
