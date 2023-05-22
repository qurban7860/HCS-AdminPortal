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

// slice
import { updateMachineModel, getMachineModel, getMachineModels } from '../../../redux/slices/products/model';

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
import { dispatchReqEditAndView, dispatchReqNavToList } from '../../asset/dispatchRequests';
import AddFormButtons from '../../components/AddFormButtons';
// ----------------------------------------------------------------------

export default function ModelEditForm() {

  const { machinemodel } = useSelector((state) => state.machinemodel);
  const { categories } = useSelector((state) => state.category);
  const dispatch = useDispatch();
  const [category, setCategory] = useState("")
  const navigate = useNavigate();
  // console.log("machineModel : ", machinemodel)

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  // useLayoutEffect(() => {
  //   dispatch(getMachineModel(id));
  // }, [dispatch, id]);

  useEffect(() => {
    if (machinemodel) {
      reset(defaultValues);
      setCategory(machinemodel.category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }}, [machinemodel])

  const EditModelSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required') ,
    description: Yup.string().max(2000),
    isDisabled : Yup.boolean(),
  });


  const defaultValues = useMemo(
    () => (
      {
        name:             machinemodel?.name || '',
        description:      machinemodel?.description || '',
        displayOrderNo:   machinemodel?.displayOrderNo || '',
        // category:      machinemodel?.category || '',
        isActive:         machinemodel?.isActive,
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
      navigate(PATH_MACHINE.machineModel.view(id))
    };

  const onSubmit = async (data) => {
   
   
      if(category){
        data.category = category
      }else{
        data.category = null;
      }
      // console.log("Data : ",data);
      await dispatchReqEditAndView(dispatch, updateMachineModel(data,id),  reset(), navigate, PATH_MACHINE.machineModel, id, enqueueSnackbar)
      // await dispatch(updateMachineModel(data,id));
      // navigate(PATH_MACHINE.machineModel.view(id));

  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>

        <Grid item xs={18} md={12}>
            <Card sx={{ mb: 3, height: 160, position: 'relative', }} >
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
                renderInput={(params) => <TextField {...params} label="Category" />}
                ChipProps={{ size: 'small' }}
              />

              <RHFTextField name="name" label="Name" />
              <RHFTextField name="description" label="Description" minRows={7} multiline />
              <RHFSwitch name="isActive" labelPlacement="start" label={
                  <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } 
                />

             </Box>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}
