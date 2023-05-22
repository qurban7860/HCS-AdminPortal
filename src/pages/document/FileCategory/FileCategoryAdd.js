import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid , Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// routes
import { PATH_CUSTOMER } from '../../../indexroutes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
// sections
import DocumentNameAddForm from './../DocumentNameAddForm';

// ----------------------------------------------------------------------

export default function DocumentNameAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={false}>
        <DocumentNameAddForm />
      </Container>
    </>
  );
}
