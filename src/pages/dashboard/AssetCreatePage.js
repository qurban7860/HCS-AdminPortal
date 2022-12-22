import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import AssetNewEditForm from '../../sections/@dashboard/asset/AssetNewEditForm';

// ----------------------------------------------------------------------

export default function AssetCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Asset: Create a new Asset</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Create a new Asset"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Asset',
              href: PATH_DASHBOARD.asset.root,
            },
            { name: 'New Asset' },
          ]}
        />
        <AssetNewEditForm />
      </Container>
    </>
  );
}
