import { Container } from '@mui/material';
import DocumentHistoryViewForm from '../../document/documents/DocumentHistoryViewForm'
import MachineTabContainer from '../util/MachineTabContainer';

export default function DrawingView() {

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue='drawings' />
      <DocumentHistoryViewForm machineDrawingPage />
    </Container>
    )
}

