import { useEffect, useLayoutEffect, useState } from 'react';
// @mui
import { Typography, Grid, Stack, Card, Divider, TextField, Autocomplete, CardHeader, Box } from '@mui/material';
import { StyledBg, StyledContainer, StyledGlobalCard } from '../../theme/styles/default-styles';
// sections
import HowickWelcome from '../components/DashboardWidgets/HowickWelcome';
import HowickWidgets from '../components/DashboardWidgets/HowickWidgets';
// assets & hooks
import { useDispatch, useSelector } from '../../redux/store';
import { getCount, getMachinesByCountry, getMachinesByModel, getMachinesByYear } from '../../redux/slices/dashboard/count';
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
import {  getActiveMachineModels } from '../../redux/slices/products/model';
import {  getCategories } from '../../redux/slices/products/category';
import { countries } from '../../assets/data';
// ----------------------------------------------------------------------
 
export default function GeneralAppPage() {
  
  const dispatch = useDispatch();
  const { count, isLoading, error, initial, responseMessage, machinesByCountry, machinesByYear, machinesByModel } = useSelector((state) => state.count);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { categories } = useSelector((state) => state.category);
  const enviroment = CONFIG.ENV.toLowerCase();
  const showDevGraphs = enviroment !== 'live';

  const [MBCYear, setMBCYear] = useState(null);
  const [MBCModel, setMBCModel] = useState(null);
  const [MBCCategory, setMBCCategory] = useState(null);
  
  const [MBMYear, setMBMYear] = useState(null);
  const [MBMCountry, setMBMCountry] = useState(null);
  const [MBMCategory, setMBMCategory] = useState(null);
  
  const [MBYCountry, setMBYCountry] = useState(null);
  const [MBYModel, setMBYModel] = useState(null);
  const [MBYCategory, setMBYCategory] = useState(null);
  
  const modelWiseMachineNumber = [];
  const yearWiseMachinesYear = [];
  const modelWiseMachineModel = [];
  const yearWiseMachinesNumber = [];
  const countryWiseMachineCountNumber = [];
  const countryWiseMachineCountCountries = [];
  const countryWiseSiteCountNumber = [];
  const countryWiseSiteCountCountries = [];
  // const yearWiseMachines = [];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, index) => 2000 + index);

  if (machinesByModel.length !== 0) {
    machinesByModel.modelWiseMachineCount.map((model) => {
      modelWiseMachineNumber.push(model.count);
      modelWiseMachineModel.push(model._id);
      return null;
    });
  }

  if (machinesByYear.length !== 0) {
    machinesByYear.yearWiseMachines.map((model) => {
      yearWiseMachinesYear.push(model._id.year.toString());
      yearWiseMachinesNumber.push(model.yearWiseMachines);
      return null;
    });
  }
  
  if (machinesByCountry.length !== 0) {
    machinesByCountry.countryWiseMachineCount.map((customer) => {
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

  const handleGraphCountry = (category, year, model) => {
    dispatch(getMachinesByCountry(category, year, model));
  };

  const handleGraphModel = (category, year, country) => {
    dispatch(getMachinesByModel(category, year, country));
  };

  const handleGraphYear = (category, model, country) => {
    dispatch(getMachinesByYear(category, model, country));
  };

  useLayoutEffect(() => {
    dispatch(getCategories());
    dispatch(getActiveMachineModels());
    dispatch(getCount());
    dispatch(getMachinesByCountry());
    dispatch(getMachinesByModel());
    dispatch(getMachinesByYear());
  }, [dispatch]);

  
  return (
    <StyledContainer maxWidth={false} p={0} >
      <Grid container item sx={{ justifyContent: 'center' }}>
        <Grid container item xs={12} md={20} lg={20} spacing={3}>
          <Grid item xs={12} md={10} lg={10} sx={{ height: { xs: 250, md: 400 }, position: 'relative'}}>
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
                connectableTitle="Decoilers / Kits" 
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
                <CardHeader
                  sx={{padding:"15px 0px 0px"}}
                  title="Machine by Countries"
                  action={
                      <Box sx={{display:'flex'}}>
                        <Autocomplete
                          sx={{width:'140px', paddingRight:1 }}
                          options={categories}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          renderOption={(props, option) => (<li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>)}
                          renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                          onChange={(event, newValue) =>{setMBCCategory(newValue?._id); handleGraphCountry(newValue?._id, MBCYear,MBCModel)}}
                        />

                        <Autocomplete
                          sx={{width:'120px', paddingRight:1 }}
                          options={activeMachineModels}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          renderOption={(props, option) => (<li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>)}
                          renderInput={(params) => (<TextField {...params} label="Model" size="small" />)}
                          onChange={(event, newValue) =>{setMBCModel(newValue?._id); handleGraphCountry(MBCCategory, MBCYear, newValue?._id)}}
                        />

                        <Autocomplete
                          sx={{ width: '120px'}}
                          options={years}
                          getOptionLabel={(option) => option.toString()}
                          renderInput={(params) => <TextField {...params} label="Year" size="small" />}
                          onChange={(event, newValue) =>{setMBCYear(newValue); ; handleGraphCountry(MBCCategory, newValue, MBCModel)}}
                        />
                      </Box>
                  }
                />
                <Divider sx={{paddingTop:2}} />
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
              <Card sx={{ px: 3, mb: 3}} variants={varFade().inDown}>
                <CardHeader
                  sx={{padding:"15px 0px 0px"}}
                  title="Machine by  Models"
                  action={

                    <Box sx={{display:'flex'}}>
                        <Autocomplete
                          sx={{width:'140px', paddingRight:1 }}
                          options={categories}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          renderOption={(props, option) => (<li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>)}
                          renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                          onChange={(event, newValue) =>{setMBMCategory(newValue?._id); handleGraphModel(newValue?._id, MBMYear,MBMCountry)}}
                        />
                        <Autocomplete
                          sx={{ width: '130px',paddingRight:1 }}
                          options={countries}
                          isOptionEqualToValue={(option, value) => option.code === value.code}
                          getOptionLabel={(option) => `${option.label ? option.label : ''}`}
                          renderInput={(params) => <TextField {...params} label="Country" size="small" />}
                          onChange={(event, newValue) =>{setMBMCountry(newValue?.code);handleGraphModel(MBMCategory, MBMYear,newValue?.code)}}
                        />

                        <Autocomplete
                          sx={{ width: '120px'}}
                          options={years}
                          getOptionLabel={(option) => option.toString()}
                          renderInput={(params) => <TextField {...params} label="Year" size="small" />}
                          onChange={(event, newValue) =>{setMBMYear(newValue);handleGraphModel(MBMCategory, newValue,MBMCountry)}}
                        />
                       
                      </Box>
                  }
                />
                <Divider sx={{paddingTop:2}} />
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
              <Card sx={{ px: 3, mb: 3}} variants={varFade().inDown}>
                <CardHeader
                  sx={{padding:"15px 0px 0px"}}
                  title="Machine by Years"
                  action={
                    <Box sx={{display:'flex'}}>
                        <Autocomplete
                          sx={{width:'140px', paddingRight:1 }}
                          options={categories}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          renderOption={(props, option) => (<li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>)}
                          renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                          onChange={(event, newValue) =>{setMBYCategory(newValue?._id); handleGraphYear(newValue?._id, MBYModel, MBYCountry)}}
                        />
                        <Autocomplete
                          sx={{width:'120px', paddingRight:1}}
                          options={activeMachineModels}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          renderOption={(props, option) => (<li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>)}
                          renderInput={(params) => (<TextField {...params} label="Model" size="small" />)}
                          onChange={(event, newValue) =>{setMBYModel(newValue?._id);handleGraphYear(MBYCategory, newValue?._id,MBYCountry)}}
                        />

                        <Autocomplete
                          sx={{ width: '120px'}}
                          options={countries}
                          isOptionEqualToValue={(option, value) => option.code === value.code}
                          getOptionLabel={(option) => `${option.label ? option.label : ''}`}
                          renderInput={(params) => <TextField {...params} label="Country" size="small" />}
                          onChange={(event, newValue) =>{setMBYCountry(newValue?.code);handleGraphYear(MBYCategory, MBYModel,newValue?.code)}}
                        />
                      </Box>
                  }
                />
                <Divider sx={{paddingTop:2}} />
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
