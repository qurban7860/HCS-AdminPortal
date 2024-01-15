import { useNavigate } from 'react-router';
import { useEffect, useLayoutEffect, useState } from 'react';
// @mui
import { Grid, Card, Divider, TextField, Autocomplete, CardHeader, Box, IconButton, Typography } from '@mui/material';
import { StyledBg, StyledContainer, StyledGlobalCard } from '../../theme/styles/default-styles';
// sections
import HowickWelcome from '../components/DashboardWidgets/HowickWelcome';
import HowickWidgets from '../components/DashboardWidgets/HowickWidgets';
// assets & hooks
import { useDispatch, useSelector } from '../../redux/store';
import { getCount, getERPLogs, getMachinesByCountry, 
  getMachinesByModel, getMachinesByYear, 
  setMachineCategory, setMachineCountry, setMachineModel, setMachineYear } from '../../redux/slices/dashboard/count';
// components
import ChartBar from '../components/Charts/ChartBar';
import ProductionLog from '../components/Charts/ProductionLog';
import ChartStacked from '../components/Charts/ChartStacked';
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
import {  getActiveCategories } from '../../redux/slices/products/category';
import { countries } from '../../assets/data';
import Iconify from '../../components/iconify';
import { PATH_DASHBOARD } from '../../routes/paths';
import { useWebSocketContext } from '../../auth/WebSocketContext';
import { fQuarterYearDate } from '../../utils/formatTime';
// ----------------------------------------------------------------------

export default function GeneralAppPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { onlineUsers } = useWebSocketContext();
  const { count, machinesByCountry, machinesByYear, machinesByModel, erpLogs } = useSelector((state) => state.count);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);
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

  const erpLogsTime = [];
  const erpLogsLength = [];
  const erpLogsWaste = [];

  const modelWiseMachineNumber = [];
  const yearWiseMachinesYear = [];
  const modelWiseMachineModel = [];
  const yearWiseMachinesNumber = [];
  const countryWiseMachineCountNumber = [];
  const countryWiseMachineCountCountries = [];
  const countryWiseSiteCountNumber = [];
  const countryWiseSiteCountCountries = [];

  useLayoutEffect(() => {
    dispatch(getActiveCategories());
    dispatch(getActiveMachineModels());
    dispatch(getCount());
    // dispatch(getMachinesByCountry());
    // dispatch(getMachinesByModel());
    // dispatch(getMachinesByYear());
    dispatch(getERPLogs());
  }, [dispatch]);

  useEffect(()=>{
    const defaultCategory = activeCategories.find((cat) => cat?.isDefault === true);
    setMBCCategory(defaultCategory);
    setMBMCategory(defaultCategory);
    setMBYCategory(defaultCategory);

    dispatch(getMachinesByCountry(defaultCategory?._id,null, null))
    dispatch(getMachinesByYear(defaultCategory?._id,null, null))
    dispatch(getMachinesByModel(defaultCategory?._id,null, null))
  },[dispatch, activeCategories])

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

  if (erpLogs.length !== 0) {
    erpLogs.map((log) => {
      erpLogsTime.push(fQuarterYearDate(log._id, 'MMM yyyy'));
      erpLogsLength.push(log.componentLength);
      erpLogsWaste.push(log.waste);
      return null;
    });
  }

  const handleGraphCountry = (category, year, model) => {
    dispatch(getMachinesByCountry(category?._id, year, model?._id));
  };

  const handleGraphModel = (category, year, country) => {
    dispatch(getMachinesByModel(category?._id, year, country?.code));
  };

  const handleGraphYear = (category, model, country) => {
    dispatch(getMachinesByYear(category?._id, model?._id, country?.code));
  };

  const handleExpandGraph = async (graph) => {
    if(graph==="country"){
      dispatch(setMachineCategory(MBCCategory));
      dispatch(setMachineYear(MBCYear));
      dispatch(setMachineModel(MBCModel));
      navigate(PATH_DASHBOARD.general.machineByCountries)
    }else if(graph==="model"){
      dispatch(setMachineCategory(MBMCategory));
      dispatch(setMachineYear(MBMYear));
      dispatch(setMachineCountry(MBMCountry));
      navigate(PATH_DASHBOARD.general.machineByModels)
    }else if(graph==="year"){
      dispatch(setMachineCategory(MBYCategory));
      dispatch(setMachineCountry(MBYCountry));
      dispatch(setMachineModel(MBYModel));
      navigate(PATH_DASHBOARD.general.machineByYears)
    }
  }
 
  

  return (
    <StyledContainer maxWidth={false}>
      <Grid container>
        <Grid container spacing={3} mt={2}>
            <Grid item xs={12}>
              <HowickWelcome title={TITLES.WELCOME} description={TITLES.WELCOME_DESC} />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={3} >
              <HowickWidgets title="Customers" total={count?.customerCount || 0}
                notVerified={count?.nonVerifiedCustomerCount || 0}
                excludedCustomers={count?.excludeReportingCustomersCount || 0}
                icon="raphael:users"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={3} >
              <HowickWidgets title="Sites" total={count?.siteCount || 0}
                icon="carbon:location-company"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={3} >
              <HowickWidgets title="Machines" total={count?.machineCount || 0}
                notVerified={count?.nonVerifiedMachineCount || 0}
                connectables={count?.connectAbleMachinesCount || 0}
                icon="vaadin:automation"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={3} >
              <HowickWidgets title="Users" total={count?.userTotalCount || 0}
                activeUsers={count?.userActiveCount || 0} 
                onlineUsers={onlineUsers && onlineUsers?.length || 0}
                icon="mdi:account-group"
              />
          </Grid>    
        </Grid>

          {/* Global widget */}
          <Grid container spacing={3} mt={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
              <StyledGlobalCard variants={varFade().inDown} >
                  <Grid container mt={2} mb={2}>
                    <Grid item xs={12} sm={4} display='flex' alignItems='center'>
                      <Typography variant='h5'>Machine by Countries</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} display='flex' justifyContent='flex-end' columnGap={0.5}>
                          <Autocomplete
                            fullWidth
                            options={activeCategories}
                            value={MBCCategory}
                            isOptionEqualToValue={(option, value) => option?._id === value?._id}
                            getOptionLabel={(option) => option?.name || ''}
                            renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                            onChange={(event, newValue) =>{
                                setMBCCategory(newValue);
                                setMBCModel(null); 
                                handleGraphCountry(newValue, MBCYear,MBCModel)
                            }}
                          />
                            <Autocomplete
                              fullWidth
                              options={activeMachineModels.filter((model) => MBCCategory ? model?.category?._id === MBCCategory?._id : model)}
                              value={MBCModel}  // Ensure that MBCModel is controlled
                              isOptionEqualToValue={(option, value) => option?._id === value?._id}
                              getOptionLabel={(option) => option?.name || ''}
                              renderInput={(params) => (<TextField {...params} label="Model" size="small" />)}
                              onChange={(event, newValue) => {
                                setMBCModel(newValue);
                                if (newValue) setMBCCategory(newValue?.category);
                                handleGraphCountry(MBCCategory, MBCYear, newValue);
                              }}
                            />

                        <Autocomplete
                          fullWidth
                          options={years}
                          getOptionLabel={(option) => option?.toString() || ''}
                          renderInput={(params) => <TextField {...params} label="Year" size="small" />}
                          onChange={(event, newValue) =>{setMBCYear(newValue); ; handleGraphCountry(MBCCategory, newValue, MBCModel)}}
                        />

                        <IconButton size='large' color="primary" onClick={()=>{handleExpandGraph('country')}}>
                          <Iconify icon="fluent:expand-up-right-20-filled" />
                        </IconButton>
                    </Grid>
                </Grid>
                <Divider/>
                <ChartBar optionsData={countryWiseMachineCountCountries} seriesData={countryWiseMachineCountNumber}
                  type="bar" sx={{ backgroundColor: 'transparent' }}
                />
              </StyledGlobalCard>
            </Grid>

            {/* Machine by  Models */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={6}>
              <Card sx={{ px: 3, mb: 3}} variants={varFade().inDown}>
                  <Grid container mt={2} mb={2}>
                    <Grid item xs={12} sm={4} display='flex' alignItems='center'>
                      <Typography variant='h5'>Machine by Models</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} display='flex' justifyContent='flex-end' columnGap={0.5}>
                      <Autocomplete
                          fullWidth
                          options={activeCategories}
                          value={MBMCategory}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                          getOptionLabel={(option) => option?.name || ''}
                          renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                          onChange={(event, newValue) =>{setMBMCategory(newValue); handleGraphModel(newValue, MBMYear,MBMCountry)}}
                        />
                        <Autocomplete
                          fullWidth
                          options={countries}
                          isOptionEqualToValue={(option, value) => option?.code === value?.code}
                          getOptionLabel={(option) => option?.label || ''}
                          renderInput={(params) => <TextField {...params} label="Country" size="small" />}
                          onChange={(event, newValue) =>{setMBMCountry(newValue);handleGraphModel(MBMCategory, MBMYear,newValue)}}
                        />

                        <Autocomplete
                          fullWidth
                          options={years}
                          getOptionLabel={(option) => option?.toString() || ''}
                          renderInput={(params) => <TextField {...params} label="Year" size="small" />}
                          onChange={(event, newValue) =>{setMBMYear(newValue);handleGraphModel(MBMCategory, newValue,MBMCountry)}}
                        />
                        <IconButton size='large' color="primary" onClick={()=>{handleExpandGraph('model')}}>
                          <Iconify icon="fluent:expand-up-right-20-filled" />
                        </IconButton>
                    </Grid>
                </Grid>
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

            <Grid item xs={12} sm={12} md={12} lg={12} xl={6} >
              <Card sx={{ px: 3, mb: 3}} variants={varFade().inDown}>
              <Grid container mt={2} mb={2}>
                    <Grid item xs={12} sm={4} display='flex' alignItems='center'>
                      <Typography variant='h5'>Machine by Years</Typography>
                    </Grid>
                    <Grid item xs={12} sm={8} display='flex' justifyContent='flex-end' columnGap={0.5}>
                        <Autocomplete
                          fullWidth
                          options={activeCategories}
                          value={MBYCategory}
                          isOptionEqualToValue={(option, value) => option?._id === value?._id}
                          getOptionLabel={(option) =>  option?.name || ''}
                          renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                          onChange={(event, newValue) =>{
                              setMBYCategory(newValue);
                              setMBYModel(null); 
                              handleGraphYear(newValue, MBYModel, MBYCountry)
                          }}
                        />
                          <Autocomplete
                            fullWidth
                            options={activeMachineModels.filter((model) => MBYCategory ? model?.category?._id === MBYCategory?._id : model)}
                            value={MBYModel}  // Ensure that MBYModel is controlled
                            isOptionEqualToValue={(option, value) => option?._id === value?._id}
                            getOptionLabel={(option) => option?.name || ''}
                            renderInput={(params) => (<TextField {...params} label="Model" size="small" />)}
                            onChange={(event, newValue) => {
                              setMBYModel(newValue);
                              if (newValue) setMBYCategory(newValue?.category);
                              handleGraphYear(MBYCategory, newValue,MBYCountry)
                            }}
                          />

                        <Autocomplete
                          fullWidth
                          options={countries}
                          isOptionEqualToValue={(option, value) => option?.code === value?.code}
                          getOptionLabel={(option) => option?.label || ''}
                          renderInput={(params) => <TextField {...params} label="Country" size="small" />}
                          onChange={(event, newValue) =>{setMBYCountry(newValue);handleGraphYear(MBYCategory, MBYModel,newValue)}}
                        />
                        <IconButton size='large' color="primary" onClick={()=>{handleExpandGraph('year')}}>
                          <Iconify icon="fluent:expand-up-right-20-filled" />
                        </IconButton>
                    </Grid>
                </Grid>
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

            <Grid item xs={12} sm={12} md={12} lg={12} xl={6} >
              <Card sx={{ px: 3, mb: 3}} variants={varFade().inDown}>
                <CardHeader titleTypographyProps={{variant:'h5'}} title="Erp Logs" sx={{mt:1, mb:2}} />
                <Divider />
                <ChartStacked 
                    chart={{
                      categories: erpLogsTime,
                      series: [ { name: 'Length', data: erpLogsLength }, { name: 'Waste', data: erpLogsWaste } ]
                    }}
                />
              </Card>
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
