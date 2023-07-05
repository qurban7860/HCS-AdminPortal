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
import DocumentCover from '../../../components/DocumentForms/DocumentCover';

// ----------------------------------------------------------------------

export default function DocumentAdd() {
  const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={false}>
      <DocumentCover content="New Document"/>
      <DocumentAddForm />
    </Container>
  );
}
