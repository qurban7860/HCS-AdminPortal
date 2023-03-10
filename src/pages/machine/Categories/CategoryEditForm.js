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
import { updateCategory, setCategoryEditFormVisibility, getCategory, getCategories } from '../../../redux/slices/category';

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


export default function CategoryEditForm() {

  const { error, category } = useSelector((state) => state.category);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  console.log(navigate, 'test')

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditCategorySchema = Yup.object().shape({
    name: Yup.string().min(5).max(25).required('Name is required') ,
    description: Yup.string().min(5).max(2000),
    isDisabled : Yup.boolean(),
    createdAt: Yup.string(),
  });


  const defaultValues = useMemo(
    () => ({
        name:category?.name || 'N/A',
        description:category?.description || 'N/A',
        createdAt: category?.createdAt || '',
        updatedAt: category?.updatedAt || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category]
  );

  const { themeStretch } = useSettingsContext();
  
  const methods = useForm({
    resolver: yupResolver(EditCategorySchema),
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
    dispatch(getCategory(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (category) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);
  console.log(id, 'testing id')

  const toggleCancel = () => 
    {
      dispatch(setCategoryEditFormVisibility(false));
      navigate(PATH_MACHINE.categories.view(id));
    };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await dispatch(updateCategory({...data,id}));
      reset(); 
      enqueueSnackbar('Update success!');
      // console.log(PATH_MACHINE.categories.view(id))
     navigate(PATH_MACHINE.categories.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(error);
    }
  };




  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
      <Helmet>
        <title> Machine: Category | Machine ERP</title>
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

              <RHFTextField name="name" label="Machine Category" required />
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
