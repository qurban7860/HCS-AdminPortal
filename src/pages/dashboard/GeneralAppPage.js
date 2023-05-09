import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useLayoutEffect } from 'react';
import Chart from "react-apexcharts";
// @mui
import { useTheme } from '@mui/material/styles';
import { Typography, Container, Grid, Stack, Button, Card   } from '@mui/material';
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

  const { count, isLoading, error, initial, responseMessage } = useSelector((state) => state.count);

  const modelWiseMachineNumber=[]
  const modelWiseMachineModel = []
  if(count && count?.modelWiseMachineCount){
    count.modelWiseMachineCount.map((model) => {
      modelWiseMachineNumber.push(model.count)
      modelWiseMachineModel.push(model._id)
      return null;
    })
  }

  const countryWiseCustomerCountNumber=[]
  const countryWiseCustomerCountCountries = []
  if(count && count.countryWiseCustomerCount){
    count.countryWiseCustomerCount.map((customer) => {
      countryWiseCustomerCountNumber.push(customer.count)
      countryWiseCustomerCountCountries.push(customer._id)
      return null;
    })
  }

  const countryWiseSiteCountNumber=[]
  const countryWiseSiteCountCountries = []
  if(count && count.countryWiseSiteCount){
    count.countryWiseSiteCount.map((site) => {
      countryWiseSiteCountNumber.push(site.count)
      countryWiseSiteCountCountries.push(site._id)
      return null;
    })
  }

 const ModelData = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: modelWiseMachineModel
      }
    },
    series: [
      {
        name: "Machine Models",
        data: modelWiseMachineNumber
      }
    ]
  };

  const CustomerData = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: countryWiseCustomerCountCountries
      }
    },
    series: [
      {
        name: "Customers",
        data: countryWiseCustomerCountNumber
      }
    ]
  };

  const SiteData = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: countryWiseSiteCountCountries
      }
    },
    series: [
      {
        name: "Sites",
        data: countryWiseSiteCountNumber
      }
    ]
  };

  useLayoutEffect(() => {
    dispatch(getCount());
  }, [dispatch]);

  return (
    <Container maxWidth={false}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <AppWelcome
            title={`CUSTOMER \n SERVICE & SUPPORT`}
            // title={`Welcome back! \n ${user?.displayName}`}
            description="Providing seamless and hassle-free experience that exceeds your expectations and helps you to achieve your business goals."
            img={
              <SeoIllustration
                sx={{
                  p: 3,
                  width: { xs: 360, md: 640 },
                  margin: { xs: 'auto', md: 'inherit' },
                  display: { xs: 'none', md: 'block' },
                }}
              />
            }
            action={
              <Button
                variant="contained"
                href="https://www.howickltd.com/products" target="_blank"
                >
                {/* we can create a shortcut here to reports for the customers */}
                OUR PRODUCTS
              </Button>
            }
          />
        </Grid>

        {/* <Grid item xs={12} md={12}>
            <AppFeatured list={_appFeatured} />
          </Grid> */}


        <Grid item xs={12} sm={6} md={3} sx={{ mt: '24px' }}>
          <AppWidgetSummary
            title="Customers"
            // percent={-0.1}
            total={count?.customerCount || 0}
            // chart={{
            //   colors: [theme.palette.warning.main],
            //   series: [8, 9, 31, 8, 16, 37, 8, 33, 46, 31],
            // }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ mt: '24px' }}>
          <AppWidgetSummary
            title="Sites"
            // percent={2.6}
            total={count?.siteCount || 0}
            // chart={{
            //   colors: [theme.palette.primary.main],
            //   series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            // }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ mt: '24px' }}>
          <AppWidgetSummary
            title="Machines"
            // percent={0.2}
            total={count?.machineCount || 0}
            // chart={{
            //   colors: [theme.palette.info.main],
            //   series: [10, 6, 4],
            // }}
          />
        </Grid>



        <Grid item xs={12} sm={6} md={3} sx={{ mt: '24px' }}>
          <AppWidgetSummary
            title="Active Users"
            // percent={2.6}
            total={count?.userCount || 0}
            // chart={{
            //   colors: [theme.palette.primary.main],
            //   series: [5, 18, 12, 51, 68, 11, 39, 37, 27, 20],
            // }}
          />
        </Grid>



        <Grid item md={12}>
          {/* widget for typography */}

          {/* <Typography variant="h1" gutterBottom color={theme.palette.bronze.main}>
           SHAPING THE\n WORLD OF CONSTRUCTION

          </Typography> */}
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
          <Grid  item xs={12} md={6} lg={6}>
            <Card sx={{px:3 ,mb:3}}>
              <Stack sx={{pt:2}}>
                <Typography variant="subtitle2">Customers</Typography>
              </Stack>
              <Chart
                options={CustomerData.options}
                series={CustomerData.series}
                type="bar"
                height="300px"
                width="100%"
              />
            </Card>
          </Grid>
          <Grid  item xs={12} md={6} lg={6}>
            <Card sx={{px:3 ,mb:3}}>
              <Stack sx={{pt:2}}>
                <Typography variant="subtitle2">Sites</Typography>
              </Stack>
              <Chart
                options={SiteData.options}
                series={SiteData.series}
                type="bar"
                height="300px"
                width="100%"
              />
            </Card>
          </Grid>
          <Grid  item xs={12} md={6} lg={6}>
            <Card sx={{px:3 ,mb:3}}>
              <Stack sx={{pt:2}}>
                <Typography variant="subtitle2">Machine Models</Typography>
              </Stack>
              <Chart
                options={ModelData.options}
                series={ModelData.series}
                type="bar"
                height="300px"
                width="100%"
              />
            </Card>
          </Grid>
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
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors title="Top Authors" list={_appAuthors} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
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
  );
}
