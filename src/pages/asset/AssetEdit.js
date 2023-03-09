import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAsset } from '../../redux/slices/asset';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import AssetEditForm from './AssetEditForm';

// ----------------------------------------------------------------------

export default function AssetEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  console.log(id);


  const { asset } = useSelector((state) => state.asset);

  useLayoutEffect(() => {
    dispatch(getAsset(id));
  }, [dispatch, id]);



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
              href: PATH_DASHBOARD.asset.list,
            },
            { name: asset?.name },
          ]}
        />

        <AssetEditForm/>
      </Container>
    </>
  );
}
