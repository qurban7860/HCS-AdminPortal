import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// routes
import { PATH_CUSTOMER } from '../../../../routes/paths';
// components
import { useSettingsContext } from '../../../../components/settings';
// sections
import DocumentAddForm from './DocumentAddForm';

// ----------------------------------------------------------------------

export default function DocumentAdd() {
  const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={false}>
      <DocumentAddForm />
    </Container>
  );
}
