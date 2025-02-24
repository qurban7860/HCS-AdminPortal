import { Container } from '@mui/material';
import CustomerViewForm from './CustomerViewForm';
import CustomerTabContainer from './util/CustomerTabContainer';

// ----------------------------------------------------------------------

export default function CustomerView() {

  return (
    <Container maxWidth={false}>
      <CustomerTabContainer currentTabValue="customer" />
      <CustomerViewForm />
    </Container>
  );
}
