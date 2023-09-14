// import { useParams } from 'react-router-dom';
// import { useLayoutEffect } from 'react';
// @mui
import { Container, Card } from '@mui/material';
// redux
// import { useDispatch } from '../../redux/store';
// import { getSecurityUser } from '../../redux/slices/securityUser/securityUser';
// sections
import ConfigEditForm from './ConfigEditForm';
import { Cover } from '../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function RegionEdit() {

  return (
    <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Edit Config" icon="mdi:user-circle" />
      </Card>
      <ConfigEditForm />
    </Container>
  );
}
