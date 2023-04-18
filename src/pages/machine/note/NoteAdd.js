import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// components
import { useSettingsContext } from '../../../components/settings';
// sections
import NoteAddForm from './NoteAddForm';

// ----------------------------------------------------------------------
export default function NoteAdd() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <NoteAddForm />
      </Container>
    </>
  );
}
