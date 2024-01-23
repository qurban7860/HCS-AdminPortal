
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput } from 'mui-tel-input';
import { Box, Card, Grid, Stack, Typography, Button } from '@mui/material';
// slice
import { updateSite, setSiteEditFormVisibility, getSite, getSites,} from '../../../redux/slices/customer/site';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
import { getCustomer } from '../../../redux/slices/customer/customer';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete } from '../../../components/hook-form';
import { countries } from '../../../assets/data';
import { SiteSchema } from '../../schemas/customer'
// ----------------------------------------------------------------------

export default function SiteEditForm() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { site } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);
  const [country, setCountryVal] = useState(countries[169]);
  const [phone, setPhone] = useState('');
  const [fax, setFaxVal] = useState('');
  
  function filtter(data, input) {
    const filteredOutput = data.filter((obj) =>
      Object.keys(input).every((filterKeys) => obj[filterKeys] === input[filterKeys])
    );
    return filteredOutput;
  }

  useEffect(() => {
    dispatch( getActiveContacts(customer?._id))
  }, [ customer, dispatch ] );

  useEffect(() => {
    if (site?.phone) {
      setPhone(site.phone);
    }
    if (site?.address?.country) {
      const siteCountry = filtter(countries, { label: site?.address?.country || '' });
      setCountryVal(siteCountry[0]);
    } else {
      setCountryVal('');
    }
    setFaxVal(site.fax);
  }, [site]);

  const defaultValues = useMemo(
    () => ({
      name: site?.name || '',
      billingSite: site?.billingSite || '',
      email: site?.email || '',
      website: site?.website || '',
      lat: site?.lat || '',
      long: site?.long || '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

    watch(); 

  useEffect(() => {
    if (site) {
      reset(defaultValues);
    }
  }, [site, reset, defaultValues]);

  const toggleCancel = () => { dispatch(setSiteEditFormVisibility(false)) };

  const updateCountryCode = () =>{
    if(phone){
      const [firstPart, ...restParts] = phone.split(' ');
      const modifiedPhoneNumber = `${country?.phone || '+64'} ${restParts.join(' ')}`;
      setPhone(modifiedPhoneNumber);
    }else{
      setPhone(country?.phone||'+64');
    }

    if(fax){
      const [firstPartFax, ...restPartsFax] = fax.split(' ');
      const modifiedFaxNumber = `${country?.phone || '+64'} ${restPartsFax.join(' ')}`;
      setFaxVal(modifiedFaxNumber)
    }else{
      setFaxVal(country?.phone || '+64')
    }
  }

  const onSubmit = async (data) => {
    data.country = country;
    try {
      if (phone && phone.length > 4) { data.phone = phone }
      if (fax && fax.length > 4) { data.fax = fax }
      await dispatch(updateSite(data, customer?._id, site?._id));
      await dispatch(getSite(customer?._id, site?._id));
      enqueueSnackbar('Site saved Successfully!');
      reset();
    } catch (err) {
      enqueueSnackbar('Site save failed!', { variant: 'error' });
      console.error(err.message);
    }
  };

  const handleTelInputChangePhone = (newValue, countryVal) => {
    if (newValue.trim() !== '') { setPhone(newValue) }
  };

  const handleTelInputChangeFax = (newValue, countryVal) => {
    if (newValue.trim() !== '') { setFaxVal(newValue) }
  };

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

                <RHFAutocomplete
                  name="country"
                  label="Country"
                  options={countries}
                  value={country}
                  getOptionLabel={(option) => `${option.label} (${option.code}) `}
                  isOptionEqualToValue={(option, value) => option?.label === value?.label }
                  onChange={(event, newValue)=> setCountryVal(newValue)}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img loading="lazy" width="20" alt=""
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                      />
                      {option?.label || ''} ({option?.code || ''}) {option?.phone || ''}
                    </Box>
                  )}
                />

                </Box>
                
                <Grid display="flex" justifyContent='flex-end'>
                  <Button variant='contained' size='small' color='warning' onClick={updateCountryCode} startIcon={<Iconify icon="ant-design:sync-outlined" />}>Update Phones Country Code</Button>
                </Grid>

                <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                
                <RHFTextField name="lat" label="Latitude" />
                <RHFTextField name="long" label="Longitude" />

                <MuiTelInput
                  value={phone}
                  name="phone"
                  label="Phone Number"
                  flagSize="medium"
                  onChange={(newValue, countryVal) => handleTelInputChangePhone(newValue, countryVal)}
                  inputProps={{maxLength:13}}
                  forceCallingCode
                  defaultCountry='NZ' 
                />

                <MuiTelInput
                  value={fax}
                  name="fax"
                  label="Fax"
                  flagSize="medium"
                  onChange={(newValue, countryVal) => handleTelInputChangeFax(newValue, countryVal)}
                  inputProps={{maxLength:13}}
                  forceCallingCode
                  defaultCountry='NZ'
                />

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
