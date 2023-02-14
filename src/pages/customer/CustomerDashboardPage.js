import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { useTheme } from '@mui/material/styles';
import { Link, Container, Grid, Stack, Button } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// _mock_
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
  _appManagers,
} from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';
// assets
import { SeoIllustration } from '../../assets/illustrations';

import { useDispatch, useSelector } from '../../redux/store';

import { getSites } from '../../redux/slices/site';
import CustomerWidget from './util/CustomerWidget';
import Iconify from '../../components/iconify';

import { PATH_DASHBOARD } from '../../routes/paths';


import CustomerDashboardNavbar from './util/CustomerDashboardNavbar';
import CustomerView from './CustomerAddForm';



// ----------------------------------------------------------------------

export default function CustomerDashboardPage() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const MACHINES = [
    { group: 'FRAMA', classify: ['FRAMA 3200', 'FRAMA 3600', 'FRAMA 4200', 'FRAMA 5200', 'FRAMA 5600', 'FRAMA 6800', 'FRAMA 7600', 'FRAMA 7800', 'FRAMA 8800', 'FRAMA Custom Female interlock'] },
    { group: 'Decoiler', classify: ['0.5T Decoiler', '1.0T Decoiler', '1.5T Decoiler', '3.0T Decoiler', '5.0T Decoiler', '6.0T Decoiler'] },
    { group: 'Rivet Cutter', classify: ['Rivet Former', 'Rivet Cutter Red', 'Rivet Cutter Green', 'Rivet Cutter Blue'] },
  ];

  const { sites, isLoading, error, initial, responseMessage } = useSelector((state) => state.site);

  const theme = useTheme();

  const navigate = useNavigate();

  const { themeStretch } = useSettingsContext();

  useLayoutEffect(() => {
    dispatch(getSites());
  }, [dispatch]);

  const handleAddCustomer = () => {
    navigate(PATH_DASHBOARD.customer.new);
  };

  const handleSearchCustomer = () => {
    navigate(PATH_DASHBOARD.customer.list);
  };

  const handleSearchSite = () => {
    navigate(PATH_DASHBOARD.site.list);
  };

  const handleSearchContact = () => {
    navigate(PATH_DASHBOARD.contact.list);
  };

  return (
    <>
      <Helmet>
        <title> General: App | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <CustomerDashboardNavbar/>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Active Users"
              percent={2.6}
              total={18765}
              chart={{
                colors: [theme.palette.primary.main],
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Machines"
              percent={0.2}
              total={20}
              chart={{
                colors: [theme.palette.info.main],
                series: [10, 6, 4],
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Customers"
              percent={-0.1}
              total={678}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Current Machines"
              chart={{
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  // theme.palette.error.main,
                  theme.palette.warning.main,
                ],
                series: [
                  { label: 'FRAMA', value: 10 },
                  { label: 'Decoiler', value: 6 },
                  { label: 'Rivet Cutter', value: 4 },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title="Sites"
              subheader="(+43%) than last year"
              chart={{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                series: [
                  {
                    year: '2019',
                    data: [
                      { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                      { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                    ],
                  },
                  {
                    year: '2020',
                    data: [
                      { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                      { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                    ],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppNewInvoice
              title="New Site"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Invoice ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated title="Top Managers" list={_appManagers} />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors title="Top Authors" list={_appAuthors} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget
                title="Conversion"
                total={38566}
                icon="eva:person-fill"
                chart={{
                  series: 48,
                }}
              />

              <AppWidget
                title="Applications"
                total={55566}
                icon="eva:email-fill"
                color="info"
                chart={{
                  series: 75,
                }}
              />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
