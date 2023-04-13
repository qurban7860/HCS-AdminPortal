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
import { Switch , TextField, Autocomplete, Box, Card, Container, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global

// slice
import { updateTechparam, getTechparam } from '../../../redux/slices/products/machineTechParam';

import { useSettingsContext } from '../../../components/settings';
import {CONFIG} from '../../../config-global';
// routes
import { PATH_MACHINE, PATH_DASHBOARD } from '../../../routes/paths';
// components
import {useSnackbar} from '../../../components/snackbar'
import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import FormProvider, { RHFSelect, RHFAutocomplete, RHFTextField, RHFSwitch, RHFMultiSelect, RHFEditor, RHFUpload, } from '../../../components/hook-form';
import {Cover} from '../../components/Cover'
// ----------------------------------------------------------------------


export default function ParameterEditForm() {

  const { techparam, error} = useSelector((state) => state.techparam);

  const { techparamcategories } = useSelector((state) => state.techparamcategory);

  const [paramVal, setParamVal] = useState(null);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const ParameterEditSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required') ,
    description: Yup.string().min(2).max(2000),
    isActive : Yup.boolean(),
    code: Yup.string(),
  });


  const defaultValues = useMemo(
    () => (
      {
        name:techparam?.name || '',
        code: techparam?.code || '',
        description: techparam?.description || '',
        isActive: techparam.isActive,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [techparam]
    );
console.log("default :",defaultValues)
  const { themeStretch } = useSettingsContext();
  
  const methods = useForm({
    resolver: yupResolver(ParameterEditSchema),
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

  // useLayoutEffect(() => {
  //   dispatch(getTechparam(id));
  // }, [dispatch, id]);

  useEffect(() => {
    if (techparam) {
      reset(defaultValues);
    }
    setParamVal(techparam.category)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techparam]);

  const toggleCancel = () => 
    {
      navigate(PATH_MACHINE.parameters.view(id));
    };

  const onSubmit = async (data) => {
    try {
      if(paramVal  !== null && paramVal  !== ""){
        data.category = paramVal?._id
      }
      // console.log("Submit Data : ",data)
      await dispatch(updateTechparam(data,techparam._id));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.parameters.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      // console.error(error);
    }
  };




  return (
    // <Container maxWidth={false }>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={18} md={12} sx={{mt: 3}}>
            <Card sx={{ mb: 3, height: 160, position: 'relative', }} >
                <Cover name='Edit Parameter' icon='ic:round-flare' />
            </Card>
          <Card sx={{ p: 3}}>
            <Stack spacing={3}>
            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', }} >
              <RHFTextField name="name" label="Machine Tech Param" required />
              <RHFTextField name="code" label="Code" required />
            </Box>
            <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)', }} >
              <RHFTextField name="description" label="Description" minRows={7} multiline />
              <Autocomplete
                value={paramVal || null}
                options={techparamcategories}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setParamVal(newValue);
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Tech Param Categories" />}
                ChipProps={{ size: 'small' }}
              />
              <RHFSwitch name="isActive" labelPlacement="start" label={
                  <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } 
                />
             </Box>
             
              </Stack>
              <Box rowGap={5} columnGap={4} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(4, 1fr)', }} > 

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
        
    </FormProvider>
    // </Container>
  );
}
