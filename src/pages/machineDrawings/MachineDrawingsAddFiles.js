import { memo } from 'react';
import { Container } from '@mui/material';
import DocumentAddForm from '../documents/DocumentAddForm';

const MachineDrawingsAddFiles = () => (
  <Container maxWidth={false} >
    <DocumentAddForm machineDrawings historyAddFiles />
  </Container>
  )

export default memo(MachineDrawingsAddFiles)