import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
// form

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
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

// ----------------------------------------------------------------------


export default function StatusEditForm() {

  const { error, machinemodel } = useSelector((state) => state.machinemodel);
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  console.log(navigate, 'test')

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditModelSchema = Yup.object().shape({
    name: Yup.string().min(5).max(25).required('Name is required') ,
    description: Yup.string().min(5).max(2000),
    isDisabled : Yup.boolean(),
    createdAt: Yup.string(),
  });


  const defaultValues = useMemo(
    () => (
      {
        name:machinemodel?.name || 'N/A',
        description:machinemodel?.description || 'N/A',
        createdAt: machinemodel?.createdAt || '',
        updatedAt: machinemodel?.updatedAt || '',
        displayOrderNo: machinemodel?.displayOrderNo || '',
        category: machinemodel?.category || '',
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

  useLayoutEffect(() => {
    dispatch(getMachineModel(id));
    

  }, [dispatch, id]);

  useEffect(() => {
    if (machinemodel) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machinemodel]);
  console.log(id, 'testing id')

  const toggleCancel = () => 
    {
      dispatch(updateMachinemodel(false));
    };

  const onSubmit = async (data) => {
    console.log(data);
    try {
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
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >

            <RHFTextField name="name" label="Machine Model" required />
              <RHFTextField name="description" label="Description" minRows={7} multiline />
              <RHFSelect native name="category" label="Category">
                    <option value="" defaultValue/>
                    { 
                    categories.length > 0 && categories.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>
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

            <Stack alignItems="flex-start" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save 
              </LoadingButton>
            </Stack>
                        
            </Card>
          
          </Grid>
        </Grid>
    </FormProvider>
  );
}
