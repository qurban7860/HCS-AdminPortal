import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { MuiTelInput } from 'mui-tel-input';
// import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  TextField,
  Autocomplete,
} from '@mui/material';
// global
// import { CONFIG } from '../../../config-global';
// slice
import {
  updateSite,
  setSiteEditFormVisibility,
  getSite,
  getSites,
} from '../../../redux/slices/customer/site';
import { getCustomer } from '../../../redux/slices/customer/customer';
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
// import GoogleMaps from '../../../assets/GoogleMaps';
import { useSnackbar } from '../../../components/snackbar';
// import Iconify from '../../../components/iconify';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFAutocomplete,
} from '../../../components/hook-form';
import { isNumberLatitude , isNumberLongitude } from './util/index'
import { countries } from '../../../assets/data';

// ----------------------------------------------------------------------

export default function SiteEditForm() {
  const { site } = useSelector((state) => state.site);
  const { customer } = useSelector((state) => state.customer);

  const { activeContacts } = useSelector((state) => state.contact);
  const [country, setCountryVal] = useState(countries[169]);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [phone, setPhone] = useState('');
  const [fax, setFaxVal] = useState('');
  const [billingContactVal, setBillingContactVal] = useState('');
  const [technicalContactVal, setTechnicalContactVal] = useState('');

  function filtter(data, input) {
    const filteredOutput = data.filter((obj) =>
      Object.keys(input).every((filterKeys) => obj[filterKeys] === input[filterKeys])
    );
    return filteredOutput;
  }

  useEffect(() => {
    if (site?.phone) {
      setPhone(site.phone);
    }
    if (site?.primaryBillingContact) {
      setBillingContactVal(site?.primaryBillingContact);
    }
    if (site?.primaryTechnicalContact) {
      setTechnicalContactVal(site?.primaryTechnicalContact);
    }
    if (site?.address?.country) {
      const siteCountry = filtter(countries, { label: site?.address?.country || '' });
      setCountryVal(siteCountry[0]);
    } else {
      setCountryVal('');
    }
    setFaxVal(site.fax);
  }, [site]);

  /* eslint-disable */
  const EditSiteSchema = Yup.object().shape({
    name: Yup.string().min(2).max(40).required().label('Name'),
    customer: Yup.string(),
    billingSite: Yup.string(),
    // phone: Yup.string().matches(phoneRegExp, {message: "Please enter valid number.", excludeEmptyString: true}).max(15, "too long"),
    email: Yup.string().trim('The contact name cannot include leading and trailing spaces'),
    // fax: Yup.string(),
    website: Yup.string(),
    lat: Yup.string().nullable()
    .max(25, 'Latitude must be less than or equal to 90.9999999999999999999999')
    .test('lat-validation', 'Invalid Latitude!, Latitude must be between -90 to 90 Degree only!', (value) =>{
      if(typeof value === 'string' && value.length > 0 && !(isNumberLatitude(value))){
        return false;
      }
      return true;
    }),

    long: Yup.string().nullable()
    .max(25, 'Longitude must be less than or equal to 180.999999999999999999999')
    .test('long-validation', 'Invalid Longitude!, Longitude must be between -180 to 180 Degree only!', (value) =>{
      if(typeof value === 'string' && value.length > 0 && !(isNumberLongitude(value))){
        return false;
      }
      return true;
    }),
    street: Yup.string(),
    suburb: Yup.string(),
    city: Yup.string(),
    region: Yup.string(),
    postcode: Yup.string(),
    country: Yup.string().nullable(),
    // primaryBillingContact: Yup.string().nullable(),
    // primaryTechnicalContact: Yup.string().nullable(),
    isActive: Yup.boolean(),
  });
  /* eslint-enable */

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
      country: site?.address?.country || '',
      isActive: site?.isActive,
      // primaryBillingContact: site?.primaryBillingContact?._id  === null || site?.primaryBillingContact?._id  === undefined  ? null : site.primaryBillingContact?._id ,
      // primaryTechnicalContact: site?.primaryTechnicalContact?._id === null || site?.primaryTechnicalContact?._id === undefined  ? null : site.primaryTechnicalContact._id,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [site]
  );

  const methods = useForm({
    resolver: yupResolver(EditSiteSchema),
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

  const toggleCancel = () => {
    dispatch(setSiteEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    try {
      if (phone && phone.length > 4) {
        data.phone = phone;
      }
      if (fax && fax.length > 4) {
        data.fax = fax;
      }
      if (country) {
        data.country = country?.label;
      }
      if (billingContactVal) {
        data.primaryBillingContact = billingContactVal?._id;
      } else {
        data.primaryBillingContact = null;
      }
      if (technicalContactVal) {
        data.primaryTechnicalContact = technicalContactVal?._id;
      } else {
        data.primaryTechnicalContact = null;
      }
      // console.log("Site Data : ",data)
      await dispatch(updateSite(data, customer?._id, site?._id));
      await dispatch(getSites(customer?._id));
      await dispatch(getSite(customer?._id, site?._id));
      await dispatch(getCustomer(customer?._id));
      enqueueSnackbar('Site saved Successfully!');
      reset();
    } catch (err) {
      enqueueSnackbar('Site save failed!', { variant: 'error' });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <RHFTextField name="name" label="Name*" />
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
                <RHFTextField name="postcode" label="Post Code" />
                <RHFAutocomplete
                  id="country-select-demo"
                  options={countries}
                  value={country || null}
                  name="country"
                  label="Country"
                  autoHighlight
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setCountryVal(newValue);
                    } else {
                      setCountryVal('');
                    }
                  }}
                  getOptionLabel={(option) => `${option.label} (${option.code}) `}
                  renderOption={(props, option) => (
                    <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                      <img
                        loading="lazy"
                        width="20"
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        alt=""
                      />
                      {option.label} ({option.code}) +{option.phone}
                    </Box>
                  )}
                  renderInput={(params) => <TextField {...params} label="Choose a country" />}
                />

                <RHFTextField name="lat" label="Latitude" />
                <RHFTextField name="long" label="Longitude" />
                <MuiTelInput
                  value={phone}
                  name="phone"
                  label="Phone Number"
                  flagSize="medium"
                  onChange={(newValue)=>setPhone(newValue)}
                  inputProps={{maxLength:13}}
                  forceCallingCode
                  defaultCountry={country?.code}
                />

                <MuiTelInput
                  value={fax}
                  name="fax"
                  label="Fax"
                  flagSize="medium"
                  onChange={(newValue)=>setFaxVal(newValue)}
                  inputProps={{maxLength:13}}
                  forceCallingCode
                  defaultCountry={country?.code}
                />

                <RHFTextField name="email" label="Email" />
                <RHFTextField name="website" label="Website" />
              </Box>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Contact Details
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
                <Autocomplete
                  // freeSolo
                  value={billingContactVal || null}
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setBillingContactVal(newValue);
                    } else {
                      setBillingContactVal('');
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>
                      {`${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                    </li>
                  )}
                  id="controllable-states-demo"
                  renderInput={(params) => (
                    <TextField {...params} label="Primary Billing Contact" />
                  )}
                  ChipProps={{ size: 'small' }}
                />

                <Autocomplete
                  // freeSolo
                  value={technicalContactVal || null}
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setTechnicalContactVal(newValue);
                    } else {
                      setTechnicalContactVal('');
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>
                      {`${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                    </li>
                  )}
                  id="controllable-states-demo"
                  renderInput={(params) => (
                    <TextField {...params} label="Primary Technical Contact" />
                  )}
                  ChipProps={{ size: 'small' }}
                />
              </Box>
              <RHFSwitch
                name="isActive"
                labelPlacement="start"
                label={
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mx: 0,
                      width: 1,
                      justifyContent: 'space-between',
                      mb: 0.5,
                      color: 'text.secondary',
                    }}
                  >
                    {' '}
                    Active
                  </Typography>
                }
              />
            </Stack>
            <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
