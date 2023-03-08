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
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../../components/hook-form';
import {CONFIG} from '../../../config-global'
// slice
import { updateSupplier, setSupplierEditFormVisibility, getSuppliers, getSupplier } from '../../../redux/slices/supplier';

import { useSettingsContext } from '../../../components/settings';
// routes
import { PATH_MACHINE, PATH_DASHBOARD } from '../../../routes/paths';
// components
import {useSnackbar} from '../../../components/snackbar'
import Iconify from '../../../components/iconify/Iconify';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';


// ----------------------------------------------------------------------


export default function SupplierEditForm() {

  const { error, supplier } = useSelector((state) => state.supplier);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  console.log(navigate, 'test')

  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditSupplierSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required')  ,
    isDisabled : Yup.boolean(),
    Contact_Name: Yup.string(),
    Contact_Title: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    fax: Yup.string(),
    website: Yup.string(),
    street: Yup.string(),
    suburb: Yup.string(),
    region: Yup.string(),
    country: Yup.string(),
  });


  const defaultValues = useMemo(
    () => ({
      name:supplier?.name || 'N/A',
        contactName:supplier?.contactName || 'N/A',
        contactTitle: supplier?.contactTitle || 'N/A',
        phone: supplier?.phone || 'N/A',
        email: supplier?.email || 'N/A',
        website: supplier?.website || 'N/A',

        street: supplier?.address?.street || 'N/A',
        suburb: supplier?.address?.suburb || 'N/A',
        city: supplier?.address?.city || 'N/A',
        region: supplier?.address?.region || 'N/A',
        country: supplier?.address?.country || 'N/A',
        createdAt: supplier?.createdAt || '',
        updatedAt: supplier?.updatedAt || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supplier]
  );

  const { themeStretch } = useSettingsContext();
  
  const methods = useForm({
    resolver: yupResolver(EditSupplierSchema),
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
    dispatch(getSupplier(id));
    // dispatch(getSites(customer._id));
    // dispatch(getSPContacts());

  }, [dispatch, id]);

  useEffect(() => {
    if (supplier) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);
  console.log(id, 'testing id')

  const toggleCancel = () => 
    {
      dispatch(setSupplierEditFormVisibility(false));
    };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      dispatch(updateSupplier({...data,id}));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.supplier.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(error);
    }
  };




  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
      <Helmet>
        <title> Machine: Supplier | Machine ERP</title>
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

              <RHFTextField name="name" label="Name of Supplier" required />
              </Box>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Contact Information
              </Typography>
              <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              {/* / //contact / */}
              <RHFTextField name="Contact_Name" label="Contact Name"/>
              <RHFTextField name="Contact_Title" label="Contact Title"/>
              <RHFTextField name="phone" label="Phone"/>
              <RHFTextField name="email" label="Email"/>
              <RHFTextField name="fax" label="Fax"/>
              <RHFTextField name="website" label="Website"/>
              </Box>
              {/* //address */}
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Address Information
              </Typography>
              <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
            
              <RHFTextField name="street" label="Street"/>
              <RHFTextField name="suburb" label="Suburb" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="region" label="Region" />
              <RHFTextField name="country" label="Country" />


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
                Save Suppliers
              </LoadingButton>
            </Stack>
                        
            </Card>
          
          </Grid>
        </Grid>
    </FormProvider>
  );
}
