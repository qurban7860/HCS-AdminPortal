import { useEffect,useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput } from 'mui-tel-input';
import { Box,Card, Grid, Stack, Typography } from '@mui/material';
// slice
import { addSite, getSites, setSiteFormVisibility } from '../../../redux/slices/customer/site';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFCountryAutocomplete, RHFCustomPhoneInput } from '../../../components/hook-form';
import { SiteSchema } from '../../schemas/customer'

// ----------------------------------------------------------------------

export default function SiteAddForm() {

  const { customer } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch( getActiveContacts(customer?._id))
    return( ) => {
      dispatch(resetActiveContacts())
    }
  }, [ customer, dispatch ] );

  const defaultValues = useMemo(
    () => ({
      name: '',
      customer: customer?._id,
      billingSite: '',
      phone: { type: 'PHONE', countryCode: '64' },
      email: '',
      fax: { type: 'FAX', countryCode: '64' },
      website: '',
      street: '',
      suburb: '',
      city: '',
      region: '',
      postcode: '',
      country: countries.find((contry)=> contry?.label?.toLocaleLowerCase() === 'New Zealand'.toLocaleLowerCase() ) || null ,
      primaryTechnicalContact: null,
      primaryBillingContact: null,
      isArchived: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(SiteSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { phone } = watch();
  console.log("phone number change : ",phone)
  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);



  const onSubmit = async (data) => {
    try {
      await dispatch(addSite(data));
      await dispatch(getSites(customer?._id))
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  const toggleCancel = () => {
    dispatch(setSiteFormVisibility(false));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Name*" />
              <Box
                rowGap={3} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="street" label="Street" />
                <RHFTextField name="suburb" label="Suburb" />
                <RHFTextField name="city" label="City" />
                <RHFTextField name="region" label="Region" />
                <RHFTextField name="postcode" label="Post Code" />
                <RHFCountryAutocomplete  name="country" label="Country" />
                <RHFTextField name="lat" label="Latitude" />
                <RHFTextField name="long" label="Longitude" />
                <RHFCustomPhoneInput name="phone" label="Phone Number" />
                <RHFCustomPhoneInput name="fax" label="Fax" />
                <RHFTextField name="email" label="Email" />
                <RHFTextField name="website" label="Website" />
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Contact Details
              </Typography>
              <Box
                rowGap={3} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFAutocomplete
                  name='primaryBillingContact'
                  label="Primary Billing Contact" 
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.firstName || ''} ${option.lastName || ''}`}</li> )}
                />
                <RHFAutocomplete
                  name='primaryTechnicalContact'
                  label="Primary Technical Contact"
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option.firstName || ''} ${option.lastName || ''}`}</li> )}
                />
              </Box>
              <RHFSwitch name="isActive" label="Active" />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
