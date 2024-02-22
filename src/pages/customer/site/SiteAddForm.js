import { useEffect,useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput } from 'mui-tel-input';
import { Box,Card, Grid, Stack, Typography, alpha, Button, IconButton } from '@mui/material';
// slice
import { addSite, getSites, setSiteFormVisibility } from '../../../redux/slices/customer/site';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFCountryAutocomplete, RHFCustomPhoneInput, RHFCheckbox } from '../../../components/hook-form';
import { SiteSchema } from '../../schemas/customer'
import Iconify from '../../../components/iconify';
// import IconTooltip from '../../../components/Icons/IconTooltip';

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
      updateAddressPrimaryBillingContact: false,
      primaryBillingContact: null,
      updateAddressPrimaryTechnicalContact: false,
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
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { phone, fax, country } = watch();

  useEffect(() => {
    if(!phone?.number){
      setValue( 'phone', { ...phone, countryCode: country?.phone?.replace(/[^0-9]/g, '')  } );
    }
    if(!fax?.number){
      setValue( 'fax', { ...fax, countryCode: country?.phone?.replace(/[^0-9]/g, '')  } );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ country ]);

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

  const updateCountryCode = () =>{
    if(phone){
          const updatedPhone ={ ...phone, countryCode: country?.phone?.replace(/[^0-9]/g, '') || '' }
      setValue('phone',updatedPhone);
    }
  
    if(fax){
          const updatedFax ={ ...phone, countryCode: country?.phone?.replace(/[^0-9]/g, '') || '' }
      setValue('fax',updatedFax)
    }
  }

  const toggleCancel = () => dispatch(setSiteFormVisibility(false));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container >
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <RHFTextField name="name" label="Name*" />
              <Box
                rowGap={2} columnGap={2} display="grid"
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
                </Box>
                <Box display="flex" alignItems="center" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }} >
                  <IconButton onClick={updateCountryCode} size="small" variant="contained" color='secondary' sx={{ mr: 0.5}} >
                    <Iconify icon="icon-park-outline:update-rotation" sx={{width: 25, height: 25}}  />
                  </IconButton>
                  <Typography variant='body2' sx={{ color:'gray'}}>Update country code in phone/fax.</Typography>
                </Box>
              <Box
                rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFCustomPhoneInput name="phone" label="Phone Number" />
                <RHFCustomPhoneInput name="fax" label="Fax" />
                <RHFTextField name="email" label="Email" />
                <RHFTextField name="website" label="Website" />
              </Box>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Contact Details
              </Typography>
              <Box
                rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
              <Box display="grid" gridTemplateColumns={{  sm: 'repeat(1, 1fr)' }}  >
                <RHFAutocomplete
                  name='primaryBillingContact'
                  label="Primary Billing Contact" 
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.firstName || ''} ${option.lastName || ''}`}</li> )}
                />
                <RHFCheckbox name="updateAddressPrimaryBillingContact" label="Update Primary Billing Contact Address" />
              </Box>
              <Box display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }} >
                <RHFAutocomplete
                  name='primaryTechnicalContact'
                  label="Primary Technical Contact"
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option.firstName || ''} ${option.lastName || ''}`}</li> )}
                />
                <RHFCheckbox name="updateAddressPrimaryTechnicalContact" label="Update Primary Technical Contact Address" />
              </Box>
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
