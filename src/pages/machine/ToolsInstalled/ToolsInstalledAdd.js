import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import ToolsInstalledAddForm from './ToolsInstalledAddForm';

// ----------------------------------------------------------------------

export default function ToolsInstalledAdd() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Container maxWidth={false }>
        <ToolsInstalledAddForm />
      </Container>
    </>
  );
}
