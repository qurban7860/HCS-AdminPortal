import { Card, Container } from '@mui/material';
import { useAuthContext } from '../../../auth/useAuthContext';
import MachineTabContainer from '../util/MachineTabContainer';
import MachineNotes from './MachineNotes';

export default function NoteList() {
  const { user, userId } = useAuthContext();

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='notes' />

      <Card sx={{ mt: 2 }}>
        <MachineNotes currentUser={{ ...user, userId }} />
      </Card>
    </Container>
  );
}