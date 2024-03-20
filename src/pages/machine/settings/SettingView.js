import { Helmet } from 'react-helmet-async';
import { useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Tab, Card, Tabs, Container, Box } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { getSite } from '../../../redux/slices/customer/site';
// components
import Iconify from '../../../components/iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
// import { SettingCover } from '';
import SettingViewForm from './SettingViewForm';
// ----------------------------------------------------------------------

export default function SettingView() {
  const dispatch = useDispatch();

  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(getSite(id));
  }, [dispatch, id]);
  //

  const { site } = useSelector((state) => state.site);

  const { themeStretch } = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('site-edit');

  const TABS = [
    {
      value: 'site-edit',
      label: 'Basic Info',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <SettingViewForm />,
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
    <Container maxWidth={false}>
      <CustomBreadcrumbs
        heading="Site View"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          {
            name: 'Site',
            href: PATH_DASHBOARD.site.list,
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
        {/* <SettingCover name={site?.name} /> */}

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

      {TABS.map(
        (tab) =>
          tab.value === currentTab && (
            <Box key={tab.value}>
              {' '}
              {tab.component ? (
                tab.component
              ) : (
                <img src="/assets/background/construction.jpg" alt="UNDER CONSTRUCTION" />
              )}{' '}
            </Box>
          )
      )}
    </Container>
  );
}
