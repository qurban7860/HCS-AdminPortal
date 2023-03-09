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
import { updateTechparamcategory, getTechparamcategory, getTechparamcategories } from '../../../redux/slices/products/tech-param';

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


export default function TechParamCategoryEditForm() {

  const { error, techparamcategory } = useSelector((state) => state.techparamcategory);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  console.log(navigate, 'test')

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditToolSchema = Yup.object().shape({
    name: Yup.string().min(5).max(25).required('Name is required') ,
    description: Yup.string().min(5).max(2000),
    isDisabled : Yup.boolean(),
    createdAt: Yup.string(),
  });


  const defaultValues = useMemo(
    () => ({
        name:techparamcategory?.name || 'N/A',
        description:techparamcategory?.description || 'N/A',
        createdAt: techparamcategory?.createdAt || '',
        updatedAt: techparamcategory?.updatedAt || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [techparamcategory]
  );

  const { themeStretch } = useSettingsContext();
  
  const methods = useForm({
    resolver: yupResolver(EditToolSchema),
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
    dispatch(getTechparamcategory(id));
    // dispatch(getSites(customer._id));
    // dispatch(getSPContacts());

  }, [dispatch, id]);

  useEffect(() => {
    if (techparamcategory) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techparamcategory]);
  console.log(id, 'testing id')

  const toggleCancel = () => 
    {
      dispatch(updateTechparamcategory(false));
    };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await dispatch(updateTechparamcategory({...data,id}));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.techParam.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(error);
    }
  };




  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
      <Helmet>
        <title> Machine: Tech Param Category | Machine ERP</title>
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

              <RHFTextField name="name" label="Machine Tool" required />
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
