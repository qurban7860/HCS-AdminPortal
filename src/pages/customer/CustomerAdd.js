// @mui

import { Container } from '@mui/material';

// sections

import CustomerAddForm from './CustomerAddForm';

// ----------------------------------------------------------------------

export default function CustomerAdd() {
  return (
    <Container maxWidth={false}>
      <CustomerAddForm />
    </Container>
  );
}
