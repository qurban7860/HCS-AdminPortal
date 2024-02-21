
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, IconButton } from '@mui/material';
// slice
import { updateSite, setSiteEditFormVisibility, getSite, getSites } from '../../../redux/slices/customer/site';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFCountryAutocomplete, RHFCustomPhoneInput, RHFCheckbox } from '../../../components/hook-form';
import { countries } from '../../../assets/data';
import { SiteSchema } from '../../schemas/customer'
// ----------------------------------------------------------------------

export default function SiteEditForm() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { site } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);

  function filtter(data, input) {
    const filteredOutput = data.filter((obj) =>
      Object.keys(input).every((filterKeys) => obj[filterKeys] === input[filterKeys])
    );
    return filteredOutput;
  }

  useEffect(() => {
    dispatch( getActiveContacts(customer?._id))
    return ()=>{
      dispatch( resetActiveContacts())
    }
  }, [ customer, dispatch ] );

  const defaultValues = useMemo(
    () => ({
      name: site?.name || '',
      billingSite: site?.billingSite || '',
      email: site?.email || '',
      website: site?.website || '',
      lat: site?.lat || '',
      long: site?.long || '',
      phone: Array.isArray(site?.phoneNumbers) && site?.phoneNumbers.find( n => n?.type?.toLowerCase() === 'phone' )  || null,
      fax: Array.isArray(site?.phoneNumbers) && site?.phoneNumbers.find( n => n?.type?.toLowerCase() === 'fax' ) || null,
      street: site?.address?.street || '',
      suburb: site?.address?.suburb || '',
      city: site?.address?.city || '',
      region: site?.address?.region || '',
      postcode: site?.address?.postcode || '',
      country: countries.find((contry)=> contry?.label?.toLocaleLowerCase() === site?.address?.country?.toLocaleLowerCase() ) || null ,
      isActive: site?.isActive,
      primaryBillingContact: site?.primaryBillingContact || null,
      updateAddressPrimaryBillingContact: site?.updateAddressPrimaryBillingContact,
      primaryTechnicalContact: site?.primaryTechnicalContact || null,
      updateAddressPrimaryTechnicalContact: site?.updateAddressPrimaryTechnicalContact,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [site]
  );

  const methods = useForm({
    resolver: yupResolver(SiteSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

    const { country, phone, fax } = watch(); 
// console.log("phone : " , phone, 'fax : ', fax);

    useEffect(() => {
      if (site?.address?.country) {
        const siteCountry = filtter(countries, { label: site?.address?.country || '' });
        setValue('country',siteCountry[0]);
      }
    }, [ site, setValue ]);

    useEffect(() => {
      if(!phone?.number){
        setValue( 'phone', { ...phone, countryCode: country?.phone  } );
      }
      if(!fax?.number){
        setValue( 'fax', { ...fax, countryCode: country?.phone  } );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ country ]);

    
  useEffect(() => {
    if (site) {
      reset(defaultValues);
    }
  }, [site, reset, defaultValues]);

  
  const updateCountryCode = () =>{
      if(phone){
            const updatedPhone ={ ...phone, countryCode: country?.phone || '' }
        setValue('phone',updatedPhone);
      }
    
      if(fax){
            const updatedFax ={ ...phone, countryCode: country?.phone || '' }
        setValue('fax',updatedFax)
      }
  }
  
  const onSubmit = async (data) => {
    try {
      await dispatch(updateSite(data, customer?._id, site?._id));
      await dispatch(getSite(customer?._id, site?._id));
      await dispatch(getSites(customer?._id ));
      enqueueSnackbar('Site saved Successfully!');
      reset();
    } catch (err) {
      enqueueSnackbar('Site save failed!', { variant: 'error' });
      console.error(err.message);
    }
  };
  
  const toggleCancel = () => dispatch(setSiteEditFormVisibility(false));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container >
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <RHFTextField name="name" label="Name*" />
              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'}}
              >
                <RHFTextField name="street" label="Street" />
                <RHFTextField name="suburb" label="Suburb" />
                <RHFTextField name="city" label="City" />
                <RHFTextField name="region" label="Region" />
                <RHFTextField name="postcode" label="Post Code" />
                <RHFCountryAutocomplete name="country" label="Country" />
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
                <RHFCustomPhoneInput name="phone" label="Phone" />
                <RHFCustomPhoneInput name="fax" label="Fax" />
                <RHFTextField name="email" label="Email" />
                <RHFTextField name="website" label="Website" />
              </Box>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Contact Details
              </Typography>

              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
              <Box display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }}  >
                <RHFAutocomplete
                  name="primaryBillingContact"
                  label="Primary Billing Contact"
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.firstName || ''} ${option.lastName || ''}`}</li>)}
                  id="controllable-states-demo"
                  ChipProps={{ size: 'small' }}
                />
                <RHFCheckbox name="updateAddressPrimaryBillingContact" label="Update Primary Billing Contact Address" />
              </Box>

              <Box display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }}  >
                <RHFAutocomplete
                  name="primaryTechnicalContact"
                  label="Primary Technical Contact"
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.firstName || ''} ${option.lastName || ''}`}</li>)}
                  id="controllable-states-demo"
                  ChipProps={{ size: 'small' }}
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
