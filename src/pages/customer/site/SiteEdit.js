import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getSite } from '../../../redux/slices/customer/site';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import SiteEditForm from './SiteEditForm';

// ----------------------------------------------------------------------

export default function SiteEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams();
  // console.log(id);


  const { site } = useSelector((state) => state.site);

  useLayoutEffect(() => {
    dispatch(getSite(id));
  }, [dispatch, id]);



  return (
    <>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Site"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Site',
              href: PATH_DASHBOARD.site.list,
            },
            { name: site?.name },
          ]}
        />

        <SiteEditForm />
      </Container>
    </>
  );
}
