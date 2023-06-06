import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid, Card } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
// routes
import { PATH_CUSTOMER } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
// sections
import DocumentCategoryAddForm from './DocumentCategoryAddForm';

// ----------------------------------------------------------------------

export default function DocumentCategoryAdd() {
  const { themeStretch } = useSettingsContext();

  return (
<<<<<<< HEAD:src/pages/document/documentCategory/FileCategoryAdd.js
    <Container maxWidth={false}>
      <DocumentNameAddForm />
    </Container>
=======
      <Container maxWidth={false}>
        <DocumentCategoryAddForm />
      </Container>
>>>>>>> bca684adc09fd2ebc5c5c522beecf745b669fbd5:src/pages/document/documentCategory/DocumentCategoryAdd.js
  );
}
