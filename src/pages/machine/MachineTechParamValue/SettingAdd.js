import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import SettingAddForm from './SettingAddForm';

// ----------------------------------------------------------------------

export default function SettingAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={false }>
        <SettingAddForm />
      </Container>
    </>
  );
}
