import { Card, Container } from '@mui/material';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
import { useAuthContext } from '../../../auth/useAuthContext';
import CustomerNotes from './CustomerNotes';

export default function NoteList() {

  const { user, userId } = useAuthContext();
  return (
    <Container maxWidth={false} >
      <CustomerTabContainer currentTabValue='notes' />
      <Card sx={{ mt: 2 }}>
        <CustomerNotes currentUser={{ ...user, userId }} />
      </Card>
    </Container>
  );
}

