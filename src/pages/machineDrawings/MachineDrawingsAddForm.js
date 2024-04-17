import { memo } from 'react';
import { Container } from '@mui/system';
import DocumentAddForm from '../documents/DocumentAddForm';

const MachineDrawingsAddForm = () => (
  <Container maxWidth={false} >
    <DocumentAddForm machineDrawings />
  </Container>
  )

export default memo(MachineDrawingsAddForm)