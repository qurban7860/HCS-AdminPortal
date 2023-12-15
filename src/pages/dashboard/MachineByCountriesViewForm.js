import {  useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container } from '@mui/system';
import { Card, Grid, Autocomplete, TextField, Divider } from '@mui/material';
// slices
import {  getMachinesByCountry } from '../../redux/slices/dashboard/count';
import {  getActiveMachineModels } from '../../redux/slices/products/model';
import {  getActiveCategories } from '../../redux/slices/products/category';
// hooks
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import { StyledGlobalCard } from '../../theme/styles/default-styles';
import ChartBar from '../components/Charts/ChartBar';
import { Cover } from '../components/Defaults/Cover';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function MachineByCountriesViewForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { machinesByCountry } = useSelector((state) => state.count);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, index) => 2000 + index);
  
  const countryWiseMachineCountNumber = [];  
  const countryWiseMachineCountCountries = [];
  
  const [MBCYear, setMBCYear] = useState(null);
  const [MBCModel, setMBCModel] = useState(null);
  const [MBCCategory, setMBCCategory] = useState(null);

  useLayoutEffect(() => {
    dispatch(getActiveCategories());
    dispatch(getActiveMachineModels(MBCCategory?._id));
    dispatch(getMachinesByCountry());
  }, [dispatch, MBCCategory]);

  if (machinesByCountry.length !== 0) {
    machinesByCountry.countryWiseMachineCount.map((customer) => {
      countryWiseMachineCountNumber.push(customer.count);
      countryWiseMachineCountCountries.push(customer._id);
      return null;
    });
  }

  const handleGraphCountry = (category, year, model) => {
    dispatch(getMachinesByCountry(category, year, model));
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
                        handleGraphCountry(newValue?._id, MBCYear,MBCModel)
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
                        handleGraphCountry(MBCCategory, MBCYear, newValue?._id);
                      }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    options={years}
                    getOptionLabel={(option) => option.toString()}
                    renderInput={(params) => <TextField {...params} label="Year" size="small" />}
                    onChange={(event, newValue) =>{setMBCYear(newValue); ; handleGraphCountry(MBCCategory, newValue, MBCModel)}}
                  />
                </Grid>
            </Grid>
            <Divider sx={{paddingTop:2}} />

            <ChartBar
              optionsData={countryWiseMachineCountCountries}
              seriesData={countryWiseMachineCountNumber}
              height={500}
              type="bar"
              sx={{ backgroundColor: 'transparent' }}
            />
      </StyledGlobalCard>          
    </Container>
  )}
