import {  useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container } from '@mui/system';
import { Card, Grid, Autocomplete, TextField, Divider } from '@mui/material';
// slices
import {  getMachinesByYear, setMachineCategory, setMachineCountry, setMachineModel } from '../../redux/slices/dashboard/count';
import {  getActiveMachineModels } from '../../redux/slices/products/model';
import {  getActiveCategories } from '../../redux/slices/products/category';
// hooks
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import { StyledGlobalCard } from '../../theme/styles/default-styles';
import ChartBar from '../components/Charts/ChartBar';
import { Cover } from '../components/Defaults/Cover';
import { PATH_DASHBOARD } from '../../routes/paths';
import { countries } from '../../assets/data';

// ----------------------------------------------------------------------

export default function MachineByCountriesViewForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { machinesByYear, machineCategory, machineModel, machineCountry } = useSelector((state) => state.count);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeCategories } = useSelector((state) => state.category);

  const yearWiseMachinesYear = [];
  const yearWiseMachinesNumber = [];

  const [MBYCountry, setMBYCountry] = useState(machineCountry);
  const [MBYModel, setMBYModel] = useState(machineModel);
  const [MBYCategory, setMBYCategory] = useState(machineCategory);

  useLayoutEffect(() => {
    dispatch(getMachinesByYear(machineCategory?._id, machineModel?._id, machineCountry?.code, true ));
  }, [dispatch, machineCategory, machineModel, machineCountry]);

  useEffect(()=>{
    dispatch(getActiveCategories());
    dispatch(getActiveMachineModels(MBYCategory?._id));
  },[dispatch, MBYCategory])

  if (machinesByYear.length !== 0) {
    machinesByYear.yearWiseMachines.map((model) => {
      yearWiseMachinesYear.push(model._id.year.toString());
      yearWiseMachinesNumber.push(model.yearWiseMachines);
      return null;
    });
  }

  const handleGraphYear = (category, model, country) => {
    dispatch(setMachineCategory(category));
    dispatch(setMachineModel(model));
    dispatch(setMachineCountry(country));
    dispatch(getMachinesByYear(category?._id, model?._id, country?.code, true));
  };

  return (
      <Container maxWidth={false}>
      <Card sx={{ mb: 3, height: 160, position: 'relative'}}>
        <Cover name="Machine By Years" icon="material-symbols:list-alt-outline" />
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
                    value={MBYCategory}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.name || ''}`}</li>)}
                    renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                    onChange={(event, newValue) =>{
                        setMBYCategory(newValue);
                        setMBYModel(null); 
                        handleGraphYear(newValue, MBYModel, MBYCountry)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Autocomplete
                      fullWidth
                      options={activeMachineModels}
                      value={MBYModel}  // Ensure that MBYModel is controlled
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option?.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                      renderInput={(params) => (<TextField {...params} label="Model" size="small" />)}
                      onChange={(event, newValue) => {
                        setMBYModel(newValue);
                        setMBYCategory(newValue?.category);
                        handleGraphYear(MBYCategory, newValue, MBYCountry)
                      }}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    options={countries}
                    value={MBYCountry}
                    isOptionEqualToValue={(option, value) => option.code === value.code}
                    getOptionLabel={(option) => `${option.label ? option.label : ''}`}
                    renderInput={(params) => <TextField {...params} label="Country" size="small" />}
                    onChange={(event, newValue) =>{
                        setMBYCountry(newValue);
                        handleGraphYear(MBYCategory, MBYModel,newValue)
                    }}
                  />
                </Grid>
            </Grid>
            <Divider sx={{paddingTop:2}} />

            <ChartBar
              optionsData={yearWiseMachinesYear}
              seriesData={yearWiseMachinesNumber}
              height={500}
              type="bar"
              sx={{ backgroundColor: 'transparent' }}
            />
      </StyledGlobalCard>          
    </Container>
  )}
