import { memo } from 'react';
import { Container } from '@mui/material';
import DocumentAddForm from '../documents/DocumentAddForm';

const MachineDrawingsAddForm = () => (
  <Container maxWidth={false} >
    <DocumentAddForm machineDrawings />
  </Container>
  )

export default memo(MachineDrawingsAddForm)