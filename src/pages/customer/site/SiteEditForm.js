
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
// slice
import { updateSite, setSiteEditFormVisibility, getSite, getSites } from '../../../redux/slices/customer/site';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFCountryAutocomplete, RHFCustomPhoneInput } from '../../../components/hook-form';
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
      primaryTechnicalContact: site?.primaryTechnicalContact || null,
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

    // console.log("phone : ",phone,'fax : ',fax)

    useEffect(() => {
      // if (site?.phone) { setValue('phone',{ numberValue : site?.phone || ''}) }
      if (site?.address?.country) {
        const siteCountry = filtter(countries, { label: site?.address?.country || '' });
        setValue('country',siteCountry[0]);
      }
      // setValue('fax',{ numberValue : site?.fax || ''});
    }, [ site, setValue ]);

    
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
              </Box>
              
                { country?.phone!==phone?.countryCode && country?.phone !==fax?.countryCode &&
                  <Grid display="flex" justifyContent='flex-end'>
                    <Typography variant='body2' sx={{mr:1,lineHeight:2, color:'gray'}}>Update country code in phone/fax</Typography>
                    <Button variant='contained' sx={{minWidth:'auto', px:1}} color='secondary' onClick={updateCountryCode}>
                      <Iconify icon="icon-park-outline:update-rotation"  />
                    </Button>
                  </Grid>
                }
              <Box
                rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                {/* defaultCountry={ country?.code } */}
                <RHFTextField name="lat" label="Latitude" />
                <RHFTextField name="long" label="Longitude" />
                <RHFCustomPhoneInput name="phone" label="Phone" />
                {/* <RHFPhoneInput name="phone" label="Phone Number" defaultCountry={phoneCountryCode} /> */}
                <RHFCustomPhoneInput name="fax" label="Fax" />
                {/* <RHFPhoneInput name="fax" label="Fax" /> */}
                <RHFTextField name="email" label="Email" />
                <RHFTextField name="website" label="Website" />
              </Box>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Contact Details
              </Typography>

              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
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
