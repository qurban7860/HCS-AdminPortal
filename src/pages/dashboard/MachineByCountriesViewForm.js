import {  useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container } from '@mui/system';
import { Card, Grid, Autocomplete, TextField, Divider, Paper } from '@mui/material';
// slices
import {  getMachinesByCountry, setMachineCategory, setMachineModel, setMachineYear } from '../../redux/slices/dashboard/count';
import {  getActiveMachineModels } from '../../redux/slices/products/model';
import {  getActiveCategories } from '../../redux/slices/products/category';
// hooks
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { StyledGlobalCard } from '../../theme/styles/default-styles';
import ChartBarAutoHeight from '../../components/Charts/ChartBarAutoHeight';
import { Cover } from '../../components/Defaults/Cover';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function MachineByCountriesViewForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { machinesByCountry, machineCategory, machineModel, machineYear } = useSelector((state) => state.count);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, index) => 2000 + index);
  
  const countryWiseMachineCountNumber = [];  
  const countryWiseMachineCountCountries = [];
  
  const [MBCYear, setMBCYear] = useState(machineYear);
  const [MBCModel, setMBCModel] = useState(machineModel);
  const [MBCCategory, setMBCCategory] = useState(machineCategory);

  useLayoutEffect(() => {
    dispatch(getActiveCategories());
    dispatch(getActiveMachineModels(machineCategory?._id));
    dispatch(getMachinesByCountry(machineCategory?._id, machineYear, machineModel?._id, true ));
  }, [dispatch, machineCategory, machineYear, machineModel]);

  useEffect(()=>{
    dispatch(getActiveMachineModels(MBCCategory?._id));  
  },[dispatch, MBCCategory])

  if (machinesByCountry.length !== 0) {
    machinesByCountry.countryWiseMachineCount.map((customer) => {
      countryWiseMachineCountNumber.push(customer.count);
      countryWiseMachineCountCountries.push(customer._id);
      return null;
    });
  }

  const handleGraphCountry = async (category, year, model) => {
    dispatch(setMachineCategory(category));
    dispatch(setMachineYear(year));
    dispatch(setMachineModel(model));
    dispatch(getMachinesByCountry(category?._id, year, model?._id));
  };

  return (
      <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative'}}>
        <Cover name="Machine By Countries" icon="material-symbols:list-alt-outline" />
      </Card>      
        <StyledGlobalCard>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mt:2, display:'flex', justifyContent:'flex-end'}}>
                <Grid item xs={12} sm={6}>
                <ViewFormEditDeleteButtons backLink={() => navigate(PATH_DASHBOARD.general.app)} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    options={activeCategories}
                    value={MBCCategory}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.name || ''}`}</li>)}
                    renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                    onChange={(event, newValue) =>{
                        setMBCCategory(newValue);
                        setMBCModel(null); 
                        handleGraphCountry(newValue, MBCYear,MBCModel)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Autocomplete
                      fullWidth
                      options={activeMachineModels}
                      value={MBCModel}  // Ensure that MBCModel is controlled
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option?.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                      renderInput={(params) => (<TextField {...params} label="Model" size="small" />)}
                      onChange={(event, newValue) => {
                        setMBCModel(newValue);
                        if (newValue) setMBCCategory(newValue?.category);
                        handleGraphCountry(MBCCategory, MBCYear, newValue);
                      }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    options={years}
                    value={MBCYear}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => <TextField {...params} label="Year" size="small" />}
                    onChange={(event, newValue) =>{
                      setMBCYear(newValue); 
                      handleGraphCountry(MBCCategory, newValue, MBCModel)
                    }}
                  />
                </Grid>
            </Grid>
            <Divider sx={{paddingTop:2}} />
            <Grid item sx={{ height: '500px', overflow: 'auto', backgroundColor: 'transparent' }} >
              {/* <Paper style={{ height: 'auto', padding: '20px', backgroundColor: 'transparent' }}> */}
                <ChartBarAutoHeight
                  optionsData={countryWiseMachineCountCountries}
                  seriesData={countryWiseMachineCountNumber}
                  type="bar"
                  sx={{ backgroundColor: 'transparent' }}
                />
              {/* </Paper> */}
            </Grid>
      </StyledGlobalCard>          
    </Container>
  )}
