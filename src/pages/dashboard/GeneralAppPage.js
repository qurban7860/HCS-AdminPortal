import { useLayoutEffect } from 'react';
// @mui
import { Typography, Grid, Stack, Card, Divider } from '@mui/material';
import { StyledBg, StyledContainer, StyledGlobalCard } from '../../theme/styles/default-styles';
// sections
import HowickWelcome from '../components/DashboardWidgets/HowickWelcome';
import HowickWidgets from '../components/DashboardWidgets/HowickWidgets';
// assets & hooks
import { useDispatch, useSelector } from '../../redux/store';
import { getCount } from '../../redux/slices/dashboard/count';
// components
import ChartBar from '../components/Charts/ChartBar';
import ProductionLog from '../components/Charts/ProductionLog';
import HowickOperators from '../components/DashboardWidgets/OperatorsWidget';
import ChartColumnNegative from '../components/Charts/ChartColumnNegative';
// constants
import { TITLES } from '../../constants/default-constants';
// dummy data
import { _appAuthors } from '../../_mock/arrays/_app';
// styles
import { varFade } from '../../components/animate';

// config-global
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const dispatch = useDispatch();
  const { count, isLoading, error, initial, responseMessage } = useSelector((state) => state.count);
  const enviroment = CONFIG.ENV.toLowerCase();
  const showDevGraphs = enviroment !== 'live';

  const modelWiseMachineNumber = [];
  const yearWiseMachinesYear = [];
  const modelWiseMachineModel = [];
  const yearWiseMachinesNumber = [];
  const countryWiseMachineCountNumber = [];
  const countryWiseMachineCountCountries = [];
  const countryWiseSiteCountNumber = [];
  const countryWiseSiteCountCountries = [];
  const yearWiseMachines = [];

  if (count && count?.modelWiseMachineCount) {
    count.modelWiseMachineCount.map((model) => {
      modelWiseMachineNumber.push(model.count);
      modelWiseMachineModel.push(model._id);
      return null;
    });
  }

  if (count && count?.yearWiseMachines) {
    count.yearWiseMachines.map((model) => {
      yearWiseMachinesYear.push(model._id.year);
      yearWiseMachinesNumber.push(model.yearWiseMachines);
      return null;
    });
  }

  if (count && count.countryWiseMachineCount) {
    count.countryWiseMachineCount.map((customer) => {
      countryWiseMachineCountNumber.push(customer.count);
      countryWiseMachineCountCountries.push(customer._id);
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

  useLayoutEffect(() => {
    dispatch(getCount());
  }, [dispatch]);

  return (
    <StyledContainer maxWidth={false} p={0}>
      <Grid container item sx={{ justifyContent: 'center' }}>
        <Grid container item xs={12} md={20} lg={20} spacing={3}>
          <Grid
            item
            xs={12}
            md={10}
            lg={10}
            sx={{
              height: { xs: 250, md: 400 },
              position: 'relative',
            }}
          >
            <HowickWelcome title={TITLES.WELCOME} description={TITLES.WELCOME_DESC} />
          </Grid>
        </Grid>

        {/* dashboard customers, sites, machines, active users */}
        <Grid container item xs={12} md={16} m={3} sx={{ justifyContent: 'center' }}>
          <Grid container item xs={12} md={16} spacing={3}>
            <Grid item xs={12} sm={6} md={5} lg={4} >
              <HowickWidgets
                title="Customers"
                total={count?.customerCount || 0}
                notVerifiedTitle="Not Verified"
                notVerifiedCount={count?.nonVerifiedCustomerCount}
                icon="mdi:account-group"
                color="warning"
                chart={{
                  series: countryWiseMachineCountNumber,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={5} lg={4}>
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
            <Grid item xs={12} sm={6} md={5} lg={4} sx={{ mt: '24px' }}>
              <HowickWidgets
                title="Machines"
                total={count?.machineCount || 0}
                notVerifiedTitle="Not Verified"
                notVerifiedCount={count?.nonVerifiedMachineCount}
                connectableTitle="Connectables" 
                connectableCount={count?.connectAbleMachinesCount}
                icon="mdi:window-shutter-settings"
                color="info"
                chart={{
                  series: modelWiseMachineNumber,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={5} lg={4} sx={{ mt: '24px' }}>
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
              <StyledGlobalCard variants={varFade().inDown}>
                <Stack sx={{ pt: 2 }}>
                  <Typography variant="h6">Machine by Countries</Typography>
                </Stack>
                <Divider />
                <ChartBar
                  optionsData={countryWiseMachineCountCountries}
                  seriesData={countryWiseMachineCountNumber}
                  type="bar"
                  height="300px"
                  width="100%"
                  color="warning"
                />
              </StyledGlobalCard>
            </Grid>

            {/* Machine Performance */}
            <Grid item xs={12} md={6} lg={6}>
              <Card
                sx={{ px: 3, mb: 3, backgroundColor: 'transparent' }}
                variants={varFade().inDown}
              >
                <Stack sx={{ pt: 2 }}>
                  <Typography variant="h6">Machine by Models</Typography>
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

            <Grid item xs={12} md={6} lg={6}>
              <Card
                sx={{ px: 3, mb: 3, backgroundColor: 'transparent' }}
                variants={varFade().inDown}
              >
                <Stack sx={{ pt: 2 }}>
                  <Typography variant="h6">Machine by Years</Typography>
                </Stack>
                <Divider />
                <ChartBar
                  optionsData={yearWiseMachinesYear}
                  seriesData={yearWiseMachinesNumber}
                  type="bar"
                  sx={{ backgroundColor: 'transparent' }}
                />
              </Card>
              <StyledBg />
            </Grid>
            {/* Production Log */}
            {/* hide this in the live, but show in development and test  */}
            {/* don't delete, will be activated once integrated with the HLC */}
            {showDevGraphs ?
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
            </Grid> : ''}

            {/* Operators */}
            {/* hide this in the live, but show in development and test  */}
            {/* don't delete, will be activated once integrated with the HLC */}
              {showDevGraphs ?
            <Grid item xs={12} lg={4}>
              <Grid item>
                <HowickOperators title="Operators" list={_appAuthors} />
              </Grid>
            </Grid>
             :'' }

          </Grid>
        </Grid>

        {/* hide this in the live, but show in development and test for now  */}
        {showDevGraphs ?
        <Grid item xs={12} md={6} lg={12}>
          <ChartColumnNegative optionsData={modelWiseMachineModel} />
          <StyledBg />
        </Grid>:'' }

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
    </StyledContainer>
  );
}
