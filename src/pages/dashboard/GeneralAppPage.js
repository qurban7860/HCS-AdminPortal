import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useLayoutEffect } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// _mock_
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
import { getCount } from '../../redux/slices/dashboard/count'



// ----------------------------------------------------------------------

export default function GeneralAppPage() {

  const dispatch = useDispatch();

  const { user } = useAuthContext();

  const MACHINES = [
    { group: 'FRAMA', classify: ['FRAMA 3200', 'FRAMA 3600', 'FRAMA 4200', 'FRAMA 5200', 'FRAMA 5600', 'FRAMA 6800', 'FRAMA 7600', 'FRAMA 7800', 'FRAMA 8800', 'FRAMA Custom Female interlock'] },
    { group: 'Decoiler', classify: ['0.5T Decoiler', '1.0T Decoiler', '1.5T Decoiler', '3.0T Decoiler', '5.0T Decoiler', '6.0T Decoiler'] },
    { group: 'Rivet Cutter', classify: ['Rivet Former', 'Rivet Cutter Red', 'Rivet Cutter Green', 'Rivet Cutter Blue'] },
  ];

  const { count, isLoading, error, initial, responseMessage } = useSelector((state) => state.count);
  console.log(count)
  const theme = useTheme();

  const { themeStretch } = useSettingsContext();

  useLayoutEffect(() => {
    dispatch(getCount());
  }, [dispatch]);


  return (
    <>
      <Helmet>
        <title> General: App | Machine ERP</title>
      </Helmet>

      <Container maxWidth={false}>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back! \n ${user?.displayName}`}
              description="If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything."
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={<Button variant="contained">Go Now</Button>}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppFeatured list={_appFeatured} />
          </Grid> */}
          <Grid item xs={12} sm={6} md={3} sx={{mt: '24px'}}>
            <AppWidgetSummary
              title="Active Users"
              // percent={2.6}
              total={count?.userCount || 0}
              chart={{
                colors: [theme.palette.primary.main],
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{mt: '24px'}}>
            <AppWidgetSummary
              title="Machines"
              // percent={0.2}
              total={count?.machineCount || 0}
              chart={{
                colors: [theme.palette.info.main],
                series: [10, 6, 4],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{mt: '24px'}}>
            <AppWidgetSummary
              title="Customers"
              // percent={-0.1}
              total={count?.customerCount || 0}
              chart={{
                colors: [theme.palette.warning.main],
                series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{mt: '24px'}}>
            <AppWidgetSummary
              title="Sites"
              // percent={2.6}
              total={count?.siteCount || 0}
              chart={{
                colors: [theme.palette.primary.main],
                series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
              }}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4}>
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
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
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
          </Grid> */}

          {/* <Grid item xs={12} lg={8}>
            <AppNewInvoice
              title="New Site"
              tableData={_appInvoices}
              tableLabels={[
                { id: 'id', label: 'Site ID' },
                { id: 'category', label: 'Category' },
                { id: 'price', label: 'Price' },
                { id: 'status', label: 'Status' },
                { id: '' },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated title="Top Related Applications" list={_appRelated} />
          </Grid> */}

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
