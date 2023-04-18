import { Helmet } from 'react-helmet-async';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box, Button } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getAssets, getAsset } from '../../redux/slices/asset';
import { getDepartments } from '../../redux/slices/department';

// auth
import { useAuthContext } from '../../auth/useAuthContext';
// _mock_
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from '../../_mock/arrays';
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AssetCover
} from './util';

import AssetViewForm from './AssetViewForm'
// ----------------------------------------------------------------------

export default function AssetViewPage() {

  const dispatch = useDispatch();

  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(getAsset(id));
  }, [dispatch, id]);
  //

  const { asset } = useSelector((state) => state.asset);

  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('asset-edit');

  const TABS = [
    {
      value: 'asset-edit',
      label: 'Basic Info',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AssetViewForm/>,
    },
    {
      value: 'configuration',
      label: 'Configuration',
      icon: <Iconify icon="eva:settings-2-outline" />,
    },
    {
      value: 'service-history',
      label: 'Service History',
      icon: <Iconify icon="eva:clock-outline" />,
    },
    {
      value: 'repair-history',
      label: 'Repair History',
      icon: <Iconify icon="eva:archive-outline" />,
    },
  ];

  return (
    <>
      <Helmet>
        <title> Asset: Information | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Asset View"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Asset',
              href: PATH_DASHBOARD.asset.list,
            },
            { name: 'View' },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <AssetCover name={asset?.name} />

          <Tabs
            value={currentTab}
            onChange={(event, newValue) => setCurrentTab(newValue)}
            sx={{
              width: 1,
              bottom: 0,
              zIndex: 9,
              position: 'absolute',
              bgcolor: 'background.paper',
              '& .MuiTabs-flexContainer': {
                pr: { md: 3 },
                justifyContent: {
                  sm: 'center',
                  md: 'flex-end',
                },
              },
            }}
          >
            {TABS.map((tab) => (
              <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Card>

        {/* <Button
                  size ="medium"
                  color ="secondary"
                  variant ="contained"
                  // href = {currentAsset.image === undefined ? '' : `localhost:5000/${currentAsset.image}`}
                  >
                    Edit Asset
          </Button>  */}
        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value}>
                {' '}
                {tab.component ? (
                  tab.component
                ) : (
                  <img src="/assets/characters/character_5" alt="UNDER CONSTRUCTION" />
                )}{' '}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
