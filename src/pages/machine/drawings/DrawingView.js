import { Container } from '@mui/material';
import { useSelector } from 'react-redux';
import DocumentHistoryViewForm from '../../documents/DocumentHistoryViewForm'
import MachineTabContainer from '../util/MachineTabContainer';

export default function DrawingView() {
  const { machine } = useSelector((state) => state.machine);
  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue='drawings' />
      <DocumentHistoryViewForm machineDrawingPage allowActions={ machine?.isArchived } />
    </Container>
    )
}

