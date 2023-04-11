import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
// form

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { TextField, Autocomplete, Box, Card, Container, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global

// slice
import { updateMachinemodel, getMachineModel, getMachinemodels } from '../../../redux/slices/products/model';

import { useSettingsContext } from '../../../components/settings';
import {CONFIG} from '../../../config-global';
// routes
import { PATH_MACHINE, PATH_DASHBOARD } from '../../../routes/paths';
// components
import {useSnackbar} from '../../../components/snackbar'
import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../../components/hook-form';
import {Cover} from '../../components/Cover';

// ----------------------------------------------------------------------


export default function ModelEditForm() {

  const { error, machinemodel } = useSelector((state) => state.machinemodel);
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [category, setCategory] = useState("")
  const navigate = useNavigate();
  // console.log(navigate, 'test')

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  useLayoutEffect(() => {
    dispatch(getMachineModel(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (machinemodel) {
      reset(defaultValues);
      setCategory(machinemodel.category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }}, [machinemodel])


  // console.log("  machinemodel",machinemodel.category)

  const EditModelSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required') ,
    description: Yup.string().min(2).max(2000),
    isDisabled : Yup.boolean(),
    createdAt: Yup.string(),
  });


  const defaultValues = useMemo(
    () => (
      {
        name:machinemodel?.name || 'N/A',
        description:machinemodel?.description || 'N/A',
        displayOrderNo: machinemodel?.displayOrderNo || '',
        // category: machinemodel?.category || '',
        isDisabled: !machinemodel?.isDisabled || '',
        createdAt: machinemodel?.createdAt || '',
        updatedAt: machinemodel?.updatedAt || '',
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machinemodel]
    );

  const { themeStretch } = useSettingsContext();
  
  const methods = useForm({
    resolver: yupResolver(EditModelSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

 
  const toggleCancel = () => 
    {
      dispatch(updateMachinemodel(false));
      navigate(PATH_MACHINE.machineModel.view(id))
    };

  const onSubmit = async (data) => {
   
    try {
      if(category){
        data.category = category
      }
      console.log("Data : ",data);
      await dispatch(updateMachinemodel({...data,id}));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machineModel.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(error);
    }
  };




  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
      <Helmet>
        <title> Machine: Model | Machine ERP</title>
      </Helmet>

      

        <Grid item xs={18} md={12}>
            <Card
              sx={{
                mb: 3,
                height: 160,
                position: 'relative',
                // mt: '24px',
              }}
            >
                <Cover name='Edit Model' icon='material-symbols:model-training-outline-rounded' />
            </Card>

          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
            {/* <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                Edit Model
                </Typography>
              </Stack> */}
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >

              <Autocomplete
                value={category || null}
                options={categories}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                  setCategory(newValue);
                  }else{
                    setCategory("");
                  }
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Categories" />}
                ChipProps={{ size: 'small' }}
              />

            <RHFTextField name="name" label="Machine Model" required />
              <RHFTextField name="description" label="Description" minRows={7} multiline />
              

              <RHFSwitch
              name="isDisabled"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                    Active
                  </Typography>
                </>
              } 
            />
             </Box>
             
              
             
              </Stack>

              <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(5, 1fr)',
                }}
              > 

                <LoadingButton 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  loading={isSubmitting}>
                    Save Changes
                </LoadingButton>

                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>

            </Box>
                        
            </Card>
          
          </Grid>
        </Grid>
    </FormProvider>
  );
}
