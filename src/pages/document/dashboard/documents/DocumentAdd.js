// @mui
import { Container } from '@mui/material';
// sections
import DocumentAddForm from './DocumentAddForm';
import DocumentCover from '../../../components/DocumentForms/DocumentCover';
import { FORMLABELS } from '../../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function DocumentAdd() {
  return (
    <Container maxWidth={false}>
      <DocumentCover content={FORMLABELS.COVER.NEW_DOCUMENT} />
      <DocumentAddForm />
    </Container>
  );
}
