import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useLayoutEffect } from 'react';
// @mui
import { useTheme, styled, alpha } from '@mui/material/styles';
import { Typography, Container, Grid, Stack, Card, Divider } from '@mui/material';
import { m } from 'framer-motion';
import Image from '../../components/image';
import { bgGradient } from '../../utils/cssStyles';
import { MotionContainer, varFade } from '../../components/animate';
import ChartBar from '../components/Charts/ChartBar';
import ChartColumnNegative from '../components/Charts/ChartColumnNegative';
import { StyledBg } from '../../theme/styles/default-styles';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// dummy datas
import { _appAuthors } from '../../_mock/arrays';
import ContainerView from '../../sections/_examples/extra/animate/background/ContainerView';
import AlertDialog from '../../sections/_examples/mui/dialog/AlertDialog';
import CarouselCenterMode from '../../sections/_examples/extra/carousel/CarouselCenterMode';
import ComponentHero from '../../sections/_examples/ComponentHero';
// sections
import HowickWelcome from '../components/DashboardWidgets/HowickWelcome';
import HowickWidgets from '../components/DashboardWidgets/HowickWidgets';
import ProductionLog from '../components/Charts/ProductionLog';
import HowickOperators from '../components/DashboardWidgets/OperatorsWidget';

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
  const countryWiseCustomerCountNumber = [];
  const countryWiseCustomerCountCountries = [];
  const countryWiseSiteCountNumber = [];
  const countryWiseSiteCountCountries = [];
  
  if (count && count?.modelWiseMachineCount) {
    count.modelWiseMachineCount.map((model) => {
      modelWiseMachineNumber.push(model.count);
      modelWiseMachineModel.push(model._id);
      return null;
    });
  }

  
  if (count && count.countryWiseCustomerCount) {
    count.countryWiseCustomerCount.map((customer) => {
      countryWiseCustomerCountNumber.push(customer.count);
      countryWiseCustomerCountCountries.push(customer._id);
      return null;
    });
  }

  
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        alignContent: 'center',
        color: 'text.primary',
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
            <HowickWelcome
              title={`CUSTOMER \n SERVICE & SUPPORT`}
              description="Providing seamless and hassle-free experience that exceeds your expectations and helps you to achieve your business goals."
            />
          </Grid>
        </Grid>

        {/* dashboard customers, sites, machines, active users */}
        <Grid container item xs={12} md={16} m={3} sx={{ justifyContent: 'center' }}>
          <Grid container item xs={12} md={16} spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <HowickWidgets
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
              <HowickWidgets
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
              <HowickWidgets
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
              <HowickWidgets
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

          {/* Global widget */}
          <Grid container item xs={12} md={16} spacing={3} mt={2}>
            <Grid item xs={12} md={6} lg={6}>
              <Card
                variants={varFade().inDown}
                sx={{
                  px: 3,
                  mb: 3,
                  backgroundImage: ` url(../../assets/illustrations/world.svg)`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'top right',
                  backgroundSize: 'auto 90%',
                }}
              >
                <Stack sx={{ pt: 2 }}>
                  <Typography variant="h6"> GLOBAL</Typography>
                </Stack>
                <Divider />
                <ChartBar
                  optionsData={countryWiseCustomerCountCountries}
                  seriesData={countryWiseCustomerCountNumber}
                  type="bar"
                  height="300px"
                  width="100%"
                  color="warning"
                />
              </Card>
            </Grid>

            {/* Machine Performance */}
            <Grid item xs={12} md={6} lg={6}>
              <Card
                sx={{ px: 3, mb: 3, backgroundColor: 'transparent' }}
                variants={varFade().inDown}
              >
                <Stack sx={{ pt: 2 }}>
                  <Typography variant="h6">Machine Performance</Typography>
                </Stack>
                <Divider />
                <ChartBar
                  optionsData={modelWiseMachineModel}
                  seriesData={modelWiseMachineNumber}
                  type="bar"
                  sx={{ backgroundColor: 'transparent' }}
                />
              </Card>
              <StyledBg />
            </Grid>

            {/* Production Log */}
            <Grid item xs={12} md={6} lg={8}>
              <ProductionLog
                title="Production Log"
                chart={{
                  categories: [
                    '2:00:00PM',
                    '2:30:00PM',
                    '2:45:00PM',
                    '4:00:00PM',
                    '7:00:00AM',
                    '10:05:00AM',
                  ],
                  series: [
                    {
                      day: '28-June-2023',
                      data: [
                        { name: 'Operator 1', data: [5000, 0, 3000, 0, 2000, 0] },
                        { name: 'Operator 2', data: [5000, 0, 4000, 0, 3000, 0] },
                        { name: 'Operator 3', data: [5500, 0, 2500, 0, 1500, 0] },
                      ],
                    },
                  ],
                }}
                sx={{ bg: 'transparent' }}
              />
              <StyledBg />
            </Grid>

            {/* Operators */}
            <Grid item xs={12} lg={4}>
              <Grid item>
                <HowickOperators title="Operators" list={_appAuthors} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* extra */}
        <Grid item xs={12} md={6} lg={12}>
          <ChartColumnNegative optionsData={modelWiseMachineModel} />
          <StyledBg />
        </Grid>

        {/* TESTs DONT REMOVE */}

        {/* <ContainerView selectVariant="panLeft">
          <Grid container spacing={3}>
              <VerticalLinearStepper/>
          </Grid>
        </ContainerView> */}

        {/* <Grid item xs={12} md={6} lg={4}>
          <AppTopRelated title="Machine Tools" list={_appRelated} />
        </Grid> */}

        {/* <Grid item xs={12} md={6} lg={4}>
          <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
        </Grid> */}
      </Grid>
    </Container>
  );
}
