import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'react-apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import { Typography, Container, Grid, Stack, Button, Card } from '@mui/material';
import { AppShortcutRounded, CenterFocusStrong } from '@mui/icons-material';
import ChartBar from '../../sections/_examples/extra/chart/ChartBar';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// _mock_
import LineChart from '../components/Charts/LineChart';
import GoogleMaps from '../../assets/GoogleMaps';
import {
  _appFeatured,
  _appAuthors,
  _appInstalled,
  _appRelated,
  _appInvoices,
} from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AppWidget,
  AppWelcome,
  AppAreaInstalled,
  AppNewInvoice,
  AppTopInstalledCountries,
  AppTopAuthors,
  AppTopRelated,
} from '../../sections/@dashboard/general/app';
// assets
import { useDispatch, useSelector } from '../../redux/store';
import { getCount } from '../../redux/slices/dashboard/count';

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const theme = useTheme();
  const { count, isLoading, error, initial, responseMessage } = useSelector((state) => state.count);

  const modelWiseMachineNumber = [];
  const modelWiseMachineModel = [];
  if (count && count?.modelWiseMachineCount) {
    count.modelWiseMachineCount.map((model) => {
      modelWiseMachineNumber.push(model.count);
      modelWiseMachineModel.push(model._id);
      return null;
    });
  }

  const countryWiseCustomerCountNumber = [];
  const countryWiseCustomerCountCountries = [];
  if (count && count.countryWiseCustomerCount) {
    count.countryWiseCustomerCount.map((customer) => {
      countryWiseCustomerCountNumber.push(customer.count);
      countryWiseCustomerCountCountries.push(customer._id);
      return null;
    });
  }

  const countryWiseSiteCountNumber = [];
  const countryWiseSiteCountCountries = [];
  if (count && count.countryWiseSiteCount) {
    count.countryWiseSiteCount.map((site) => {
      countryWiseSiteCountNumber.push(site.count);
      countryWiseSiteCountCountries.push(site._id);
      return null;
    });
  }

  const ModelData = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: modelWiseMachineModel,
      },
    },
    series: [
      {
        name: 'Machine Models',
        data: modelWiseMachineNumber,
      },
    ],
  };

  const CustomerData = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: countryWiseCustomerCountCountries,
      },
    },
    series: [
      {
        name: 'Customers',
        data: countryWiseCustomerCountNumber,
      },
    ],
  };

  const SiteData = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: countryWiseSiteCountCountries,
      },
    },
    series: [
      {
        name: 'Sites',
        data: countryWiseSiteCountNumber,
      },
    ],
  };

  useLayoutEffect(() => {
    dispatch(getCount());
  }, [dispatch]);
  console.log('ModelData.options : ', ModelData.options);
  console.log('ModelData.series : ', ModelData.series);
  console.log('CustomerData.options : ', CustomerData.options);

  return (
    <Container
      maxWidth={false}
      p={0}
      sx={{
        backgroundImage: `url(../../assets/illustrations/illustration_howick_icon.svg)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top right',
        backgroundSize: 'auto 90%',
        backgroundOpacity: 0.1,
        backgroundAttachment: 'fixed',
        // height: '100%',
        // width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        alignContent: 'center',
      }}
    >
      <Grid container item sx={{ justifyContent: 'center' }}>
        <Grid container item xs={12} md={20} lg={20} spacing={3}>
          <Grid
            item
            xs={12}
            md={10}
            lg={6}
            sx={{
              height: { xs: 250, md: 400 },
              position: 'relative',
            }}
          >
            <AppWelcome
              title={`CUSTOMER \n SERVICE & SUPPORT`}
              description="Providing seamless and hassle-free experience that exceeds your expectations and helps you to achieve your business goals."
            />
          </Grid>
        </Grid>

        <Grid container item xs={12} md={16} m={3} sx={{ justifyContent: 'center' }}>
          <Grid container item xs={12} md={16} spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidget
                title="Customers"
                total={count?.customerCount || 0}
                icon="mdi:account-group"
                color="warning"
                chart={{
                  series: countryWiseCustomerCountNumber,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppWidget
                title="Sites"
                total={count?.siteCount || 0}
                icon="mdi:office-building-marker"
                color="bronze"
                chart={{
                  series: countryWiseSiteCountNumber,
                }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} md={16} spacing={3}>
            <Grid item xs={12} sm={6} md={3} sx={{ mt: '24px' }}>
              <AppWidget
                title="Machines"
                total={count?.machineCount || 0}
                icon="mdi:window-shutter-settings"
                color="info"
                chart={{
                  series: modelWiseMachineNumber,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} sx={{ mt: '24px' }}>
              <AppWidget
                title="Active Users"
                total={count?.userCount || 0}
                icon="mdi:account"
                color="error"
                chart={{
                  series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
                }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} md={16} spacing={3} mt={2}>
            <Grid item xs={12} md={6} lg={6}>
              <Card sx={{ px: 3, mb: 3 }}>
                <Stack sx={{ pt: 2 }}>
                  <Typography variant="subtitle2">Howick GLOBAL</Typography>
                </Stack>

                <ChartBar
                  optionsData={countryWiseCustomerCountCountries}
                  seriesData={countryWiseCustomerCountNumber}
                  type="bar"
                  height="300px"
                  width="100%"
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Card sx={{ px: 3, mb: 3 }}>
                <Stack sx={{ pt: 2 }}>
                  <Typography variant="subtitle2">Machine Performance</Typography>
                </Stack>
                <ChartBar
                  optionsData={modelWiseMachineModel}
                  seriesData={modelWiseMachineNumber}
                  type="bar"
                />
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AppAreaInstalled
                title="Sites Installed"
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

            <Grid item xs={12} lg={4}>
              <AppNewInvoice
                title="Service desk"
                tableData={_appInvoices}
                tableLabels={[
                  { id: 'id', label: 'Site ID' },
                  { id: 'name', label: 'Name' },
                  { id: 'status', label: 'Status' },
                ]}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <AppTopRelated title="Machine Tools" list={_appRelated} />
        </Grid>

        {/* <Grid item xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid> */}

        {/* <Grid item xs={12} md={6} lg={4}>
          <AppTopAuthors title="Howick Active Users" list={_appAuthors} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
