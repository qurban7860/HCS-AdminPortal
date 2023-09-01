import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, TextField, Autocomplete } from '@mui/material';
// slice
import { addSite, setSiteFormVisibility } from '../../../redux/slices/customer/site';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import GoogleMaps from '../../../assets/GoogleMaps';
import { isNumberLatitude , isNumberLongitude } from './util/index'
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function SiteAddForm() {
  const { siteAddFormVisibility } = useSelector((state) => state.site);

  const { customer } = useSelector((state) => state.customer);

  const { contacts, activeContacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [phone, setPhone] = useState('');
  const [country, setCountryVal] = useState('');
  const [fax, setFaxVal] = useState('');
  const [billingContactVal, setBillingContactVal] = useState('');
  const [technicalContactVal, setTechnicalContactVal] = useState('');
  useEffect(() => {
    // primaryBillingContact: Yup.string().nullable(),
    // primaryTechnicalContact: Yup.string().nullable(),
  }, []);
  /* eslint-disable */
  const AddSiteSchema = Yup.object().shape({
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
    // country: Yup.string().nullable(),
    // primaryBillingContact: Yup.string().nullable(),
    // primaryTechnicalContact: Yup.string().nullable(),
    isActive: Yup.boolean(),
  });
  /* eslint-enable */

  const defaultValues = useMemo(
    () => ({
      name: '',
      customer: customer?._id,
      billingSite: '',
      // phone: '',
      email: '',
      // fax: '',
      website: '',
      street: '',
      suburb: '',
      city: '',
      region: '',
      postcode: '',
      // country: null,
      isArchived: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddSiteSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // if (!siteAddFormVisibility) {
    //   dispatch(setsiteAddFormVisibility(true));
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const onChange = (event) => {
    const value = event.target.value;
    // console.log('value----->',value);
  };

  const handlePhoneChange = (newValue) => {
    matchIsValidTel(newValue)
    if(newValue.length < 17){
      setPhone(newValue);
    }
  };

  const handleFaxChange = (newValue) => {
    matchIsValidTel(newValue)
    if(newValue.length < 17){
      setFaxVal(newValue);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (phone) {
        data.phone = phone;
      }
      if (fax) {
        data.fax = fax;
      }
      if (country) {
        data.country = country.label;
      }
      if (billingContactVal) {
        data.primaryBillingContact = billingContactVal?._id;
      }
      if (technicalContactVal) {
        data.primaryTechnicalContact = technicalContactVal?._id;
      }
      await dispatch(addSite(data));
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
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                {/* <RHFTextField name="phone" label="Phone" /> */}
                <MuiTelInput
                  value={phone}
                  name="phone"
                  label="Phone Number"
                  flagSize="medium"
                  defaultCountry="NZ"
                  onChange={handlePhoneChange}
                  forceCallingCode
                />

                {/* <RHFTextField name="fax" label="Fax" /> */}
                <MuiTelInput
                  value={fax}
                  name="fax"
                  label="Fax"
                  flagSize="medium"
                  defaultCountry="NZ"
                  onChange={handleFaxChange}
                  forceCallingCode
                />

                <RHFTextField name="email" label="Email" />
                <RHFTextField name="website" label="Website" />
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

                <RHFTextField name="postcode" label="Post Code" />

                {/* <RHFSelect native name="country" label="Country" placeholder="Country">
                  <option defaultValue value="null" selected >No Country Selected</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.label}>
                      {country.label}
                    </option>
                  ))}
                </RHFSelect> */}
                {/* <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  ChipProps={{ size: 'small' }}
                /> */}
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
                  options={contacts}
                  isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
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
                  options={contacts}
                  isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
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
