// @mui
import { Container } from '@mui/material';
// sections
import MachineViewForm from './MachineViewForm';
import MachineTabContainer from './util/MachineTabContainer';

// ----------------------------------------------------------------------

export default function MachineView( ) {

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="machine" />
      <MachineViewForm />
    </Container>
  );
}
