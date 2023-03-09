import PropTypes from 'prop-types';
import * as Yup from 'yup';
import axios from 'axios';
import { useLayoutEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Container,Checkbox, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// asset
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../../components/hook-form';
import { countries } from '../../../assets/data';
import { createLicenses } from '../../../redux/slices/products/license';
// routes
import { PATH_MACHINE } from '../../../routes/paths';

import { useSettingsContext } from '../../../components/settings';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSnackbar } from '../../../components/snackbar';

// auth
import { useAuthContext } from '../../../auth/useAuthContext';

// util
import MachineDashboardNavbar from '../util/MachineDashboardNavbar';


// ----------------------------------------------------------------------

export default function MachineLicenses() {

  const { userId, user } = useAuthContext();
  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    machine: Yup.string(),
    licenseKey: Yup.string().min(5).max(40).required('Key is required'),
    version:Yup.string(),
    type:Yup.string(),
    deviceName:Yup.string(),
    deviceGUID:Yup.string(),
    production:Yup.number(),
    waste:Yup.number(),
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
    isDisabled : Yup.boolean(),
    extensionTime : Yup.date(),
    requestTime : Yup.date(),
    
  });

  const defaultValues = useMemo(
    () => ({
        machine: machine._id,
        licenseKey: '',
        version:'',
        type:'',
        deviceName:'',
        deviceGUID:'',
        production:'',
        waste:'',
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
        extensionTime: '',
        requestTime: '',

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

      licenseKey:data.licenseKey,
      version:data.version,
      type:data.type,
      deviceName:data.deviceName,
      deviceGUID:data.deviceGUID,
      production:data.production,
      waste:data.waste,
      extensionTime:data.extensionTime,
      requestTime:data.requestTime,
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
        await dispatch(createLicenses(finalData));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_MACHINE.license.list); 
        // console.log(PATH_MACHINE.supplier.list)
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
          heading="Licenses"
          links={[
            { name: 'Dashboard', href: PATH_MACHINE.root },
            { name: 'License' },
          ]}
        />

        </div>
    
      </Container>

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

              <RHFTextField name="licenseKey" label="Lisence Key" required />
              </Box>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              License Detail
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
              {/* / //license / */}
              <RHFTextField name="version" label="Version"/>
              <RHFTextField name="type" label="Type"/>
              <RHFTextField name="deviceName" label="Device Name"/>
              <RHFTextField name="deviceGUID" label="Device GUID"/>
              <RHFTextField name="production" label="Production" type="number"/>
              <RHFTextField name="waste" label="Waste" type="number"/>
              <RHFTextField name="extensionTime" label="Extension Time" type="datetime-local"/>
              <RHFTextField name="requestTime" label="Request Time" type="datetime-local"/>
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
                Save Licenses
              </LoadingButton>
            </Stack>
                        
            </Card>
          
          </Grid>
        </Grid>
    </FormProvider>
  );
}