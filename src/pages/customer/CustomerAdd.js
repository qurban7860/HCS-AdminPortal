import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid , Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import CustomerAddForm from './CustomerAddForm';

// ----------------------------------------------------------------------

export default function CustomerAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      {/* <Helmet>
        <title> Customer: Add Customer</title>
      </Helmet> */}
      

      <Container maxWidth={false}>
        <CustomerAddForm />
      </Container>
    </>
  );
}
