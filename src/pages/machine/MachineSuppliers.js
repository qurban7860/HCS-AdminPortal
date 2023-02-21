import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {Container} from '@mui/material';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import style from '../../style/style.css'

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getSPContacts } from '../../redux/slices/contact';
import { createSuppliers } from '../../redux/slices/supplier';
// routes
import { PATH_DASHBOARD,PATH_MACHINE } from '../../routes/paths';

import { useSettingsContext } from '../../components/settings';
// components
import { useSnackbar } from '../../components/snackbar';
import { Checkbox } from '@mui/material'
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../components/hook-form';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// asset
import { countries } from '../../assets/data';
// util
import MachineDashboardNavbar from './util/MachineDashboardNavbar';


// ----------------------------------------------------------------------

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

const CONTACT_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'financial', label: 'Financial' },
  { value: 'support', label: 'Support' },
];



export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {

  const MACHINE_TOOLS = [
    { value: 'technical', label: 'Technical' },
    { value: 'financial', label: 'Financial' },
    { value: 'support', label: 'Support' },
  ];

  const { userId, user } = useAuthContext();

  const { spContacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required')  ,
    isDisabled : Yup.boolean(),
    Contact_Name: Yup.string(),
    Contact_Title: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email(),
    fax: Yup.string(),
    website: Yup.string(),
    street: Yup.string(),
    suburb: Yup.string(),
    region: Yup.string(),
    country: Yup.string(),
    
  });

  const defaultValues = useMemo(
    () => ({
      name: ''  ,
      Contact_Name: '',
      Contact_Title: '',
      phone: '',
      email: '',
      fax: '',
      website: '',
      street: '',
      suburb: '',
      region: '',
      country: '',
      isDisabled: false,
      
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
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
  //   dispatch(getSPContacts());
  // }, [dispatch]);


  const onSubmit = async (data) => {

    const finalData = {
      name:data.name,
      contactName:data.Contact_Name,
      contactTitle:data.Contact_Title,
      phone:data.phone,
      email:data.email,
      website:data.website,
      isDisabled:data.isDisabled,
      address:{
        street:data.street,
        suburb:data.suburb,
        city:data.city,
        region:data.region,
        country:data.country
      }
    }
      try{ 
        await dispatch(createSuppliers(finalData));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_MACHINE.general.detail); 
      } catch(error){
        // enqueueSnackbar('Saving failed!');
        enqueueSnackbar(error?.message)
        console.error(error);
      }
  };

  

  const { themeStretch } = useSettingsContext();
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
      <Helmet>
        <title> Machine: Supplier | Machine ERP</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <div style={{paddingTop:'20px'}}>
      <CustomBreadcrumbs 
          heading="Suppliers"
          links={[
            { name: 'Dashboard', href: PATH_MACHINE.root },
            { name: 'Supplier' },
          ]}
        />

        </div>
    
      </Container>

        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={6}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Name of Supplier" required 

              />
              <RHFTextField name="Contact_Name" label="Contact Name"/>
              <RHFTextField name="Contact_Title" label="Contact Title"/>
              {/* / //contact / */}
              <RHFTextField name="phone" label="Phone"/>
              <RHFTextField name="email" label="Email"/>
              <RHFTextField name="fax" label="Fax"/>
              <RHFTextField name="website" label="Website"/>
              {/* //address */}
              <RHFTextField name="street" label="Street"/>
              <RHFTextField name="suburb" label="suburb" />
              <RHFTextField name="city" label="city" />
              <RHFTextField name="region" label="region" />
              <RHFTextField name="country" label="country" />


              <RHFSwitch
              name="isDisabled"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
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