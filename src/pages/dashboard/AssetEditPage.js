import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAssets } from '../../redux/slices/asset';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import AssetNewEditForm from '../../sections/@dashboard/asset/AssetNewEditForm';

// ----------------------------------------------------------------------

export default function AssetEditPage() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  console.log(id);


  const currentAsset = useSelector((state) =>
  state.asset.assets.find((asset) => asset._id === id)
  );

  // console.log(assets);

  useEffect(() => {
    dispatch(getAssets());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title> Asset: Edit Page | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Asset"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Asset',
              href: PATH_DASHBOARD.asset.root,
            },
            { name: currentAsset?.name },
          ]}
        />

        <AssetNewEditForm 
          isEdit
          currentAsset={currentAsset} 
        />
      </Container>
    </>
  );
}
