import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getCustomers } from '../../redux/slices/customer';

import { saveSite } from '../../redux/slices/site';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';

import { useAuthContext } from '../../auth/useAuthContext';

import { countries } from '../../assets/data';


import FormProvider, {
  RHFSelect,
  RHFSwitch,
  RHFUpload,
  RHFTextField,
} from '../../components/hook-form';

// ----------------------------------------------------------------------

SiteAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentSite: PropTypes.object,
};

export default function SiteAddForm({ isEdit, readOnly, currentSite }) {

  const { error } = useSelector((state) => state.site);

  const { customers } = useSelector((state) => state.customer);
  
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const AddSiteSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required'),
    customer: Yup.string(),
    billingSite: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    fax: Yup.string(),
    website: Yup.string(),
    street: Yup.string(),
    suburb: Yup.string(),
    city: Yup.string(),
    region: Yup.string(),
    country: Yup.string(),

  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      customer: '',
      billingSite: '',
      phone: '',
      email: '',
      fax: '',
      website: '',
      street: '',
      suburb: '',
      city: '',
      region: '',
      country: '',
      isArchived: false,

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSite]
  );

  const methods = useForm({
    resolver: yupResolver(AddSiteSchema),
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
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  const onSubmit = async (data) => {
    console.log(data);
      try{
        await dispatch(saveSite(data));
        // reset();
        enqueueSnackbar('Create success!');
        // navigate(PATH_DASHBOARD.site.list);
      } catch(err){
        enqueueSnackbar('Saving failed!');
        console.error(err);
      }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Name" />

              {/* <RHFTextField name="tradingName" label="Trading Name" /> */}

              <RHFSelect native name="customer" label="Customer">
                    <option value="" selected/>
                    { 
                    customers.length > 0 && customers.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>

              <RHFTextField name="phone" label="Phone" />

              <RHFTextField name="email" label="Email" />

              <RHFTextField name="fax" label="Fax" />

              <RHFTextField name="webiste" label="Website" />
             
              </Box>  


              
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Address Details
              </Typography>

              <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

              <RHFTextField name="street" label="Street" />

              <RHFTextField name="suburb" label="Suburb" />

              <RHFTextField name="city" label="City" />

              <RHFTextField name="region" label="Region" />

              <RHFSelect native name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect>

            </Box>  
            </Stack>



            <Stack alignItems="flex-start" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Site
              </LoadingButton>
            </Stack>



            
          </Card>
          
        </Grid>
      </Grid>
    </FormProvider>
  );
}
