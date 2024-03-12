import {  useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container } from '@mui/system';
import { Card, Grid, Autocomplete, TextField, Divider } from '@mui/material';
// slices
import {  getMachinesByModel, setMachineCategory, setMachineCountry, setMachineYear } from '../../redux/slices/dashboard/count';
import {  getActiveCategories } from '../../redux/slices/products/category';
// hooks
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ChartBarAutoHeight from '../../components/Charts/ChartBarAutoHeight';
import { Cover } from '../../components/Defaults/Cover';
import { PATH_DASHBOARD } from '../../routes/paths';
import { countries } from '../../assets/data';

// ----------------------------------------------------------------------

export default function MachineByCountriesViewForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { machinesByModel, machineCategory, machineYear, machineCountry } = useSelector((state) => state.count);
  const { activeCategories } = useSelector((state) => state.category);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, index) => 2000 + index);
  const modelWiseMachineNumber = [];
  const modelWiseMachineModel = [];
  const modelWiseSeries = [];
  
  const [MBMYear, setMBMYear] = useState(machineYear);
  const [MBMCountry, setMBMCountry] = useState(machineCountry);
  const [MBMCategory, setMBMCategory] = useState(machineCategory);
  
  useLayoutEffect(() => {
    dispatch(getActiveCategories());
    dispatch(getMachinesByModel(machineCategory?._id, machineYear, machineCountry?.code, true));
  }, [dispatch, machineCategory, machineYear, machineCountry]);

  if (machinesByModel.length !== 0) {
    machinesByModel.modelWiseMachineCount.map((model) => {
      modelWiseMachineNumber.push(model.count);
      modelWiseMachineModel.push(model._id);
      modelWiseSeries.push({name: model._id, data: model.count});
      return null;
    });
  }
  
  const handleGraphModel = (category, year, country) => {
    dispatch(setMachineCategory(category));
    dispatch(setMachineYear(year));
    dispatch(setMachineCountry(country));
    dispatch(getMachinesByModel(category?._id, year, country?.code, true));
  };

  return (
      <Container maxWidth={false}  sx={{ height: 'auto'}} >
      <Card sx={{ mb: 3, height: 160, position: 'relative'}}>
        <Cover name="Machine By Models" icon="material-symbols:list-alt-outline" />
      </Card>      
        <Card sx={{p:2, pt:0}}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{mt:2, display:'flex', justifyContent:'flex-end'}}>
                <Grid item xs={12} sm={6}>
                <ViewFormEditDeleteButtons backLink={() => navigate(PATH_DASHBOARD.root)} />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Autocomplete
                    fullWidth
                    options={activeCategories}
                    value={MBMCategory}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>)}
                    renderInput={(params) => (<TextField {...params} label="Categories" size="small" />)}
                    onChange={(event, newValue) =>{
                        setMBMCategory(newValue); 
                        handleGraphModel(newValue, MBMYear,MBMCountry)
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Autocomplete
                          fullWidth
                          options={countries}
                          value={MBMCountry}
                          isOptionEqualToValue={(option, value) => option.code === value.code}
                          getOptionLabel={(option) => `${option.label ? option.label : ''}`}
                          renderInput={(params) => <TextField {...params} label="Country" size="small" />}
                          onChange={(event, newValue) =>{
                              setMBMCountry(newValue);
                              handleGraphModel(MBMCategory, MBMYear,newValue)
                          }}
                        />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Autocomplete
                      fullWidth
                      options={years}
                      value={MBMYear}
                      getOptionLabel={(option) => option.toString()}
                      renderInput={(params) => <TextField {...params} label="Year" size="small" />}
                      onChange={(event, newValue) =>{
                        setMBMYear(newValue);
                        handleGraphModel(MBMCategory, newValue,MBMCountry)
                      }}
                    />
                </Grid>
            </Grid>
            <Divider sx={{paddingTop:2}} />
            <ChartBarAutoHeight
              optionsData={modelWiseMachineModel}
              seriesData={modelWiseMachineNumber}
              seriesD={modelWiseSeries}
              type="bar"
              sx={{ backgroundColor: 'transparent' }}
            />
      </Card>          
    </Container>
  )}
