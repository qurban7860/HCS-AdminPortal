// @mui
import { Container } from '@mui/material';
// sections
import DocumentCategoryAddForm from './DocumentCategoryAddForm';

// ----------------------------------------------------------------------

export default function DocumentCategoryAdd() {
  // const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={false}>
      <DocumentCategoryAddForm />
    </Container>
  );
}
