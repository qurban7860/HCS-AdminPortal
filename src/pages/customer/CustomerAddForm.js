import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { m } from 'framer-motion';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Checkbox,Container , FormControlLabel,Autocomplete, DialogTitle, Dialog, InputAdornment, TextField } from '@mui/material';
// slice
// import { getSPContacts } from '../../redux/slices/contact';
import { saveCustomer } from '../../redux/slices/customer/customer';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFMultiSelect
} from '../../components/hook-form';
import { MotionContainer, varBounce } from '../../components/animate';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// asset
import { countries } from '../../assets/data';
// util
import CustomerDashboardNavbar from './util/CustomerDashboardNavbar';
import { Cover } from '../components/Cover';


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

const types = [
  { value: 'technical', label: 'Technical' },
  { value: 'financial', label: 'Financial' },
  { value: 'support', label: 'Support' },
];

export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {

  const { userId, user } = useAuthContext();

  const { spContacts } = useSelector((state) => state.contact);

  const { customer, customerSaveSuccess } = useSelector((state) => state.customer);

  const [contactFlag, setCheckboxFlag] = useState(false);

  const toggleCheckboxFlag = () => setCheckboxFlag(value => !value);

  // console.log('checked ------> ', contactFlag);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const numberRegExp = /^[0-9]+$/;

  const [phone, setPhone] = useState('')
  const [country, setCountryVal] = useState('')
  const [fax, setFaxVal] = useState('')
  const [billingContactPhone, setBillingContactPhone] = useState('')
  const [technicalContactPhone, setTechnicalContactPhone] = useState('')


  const AddCustomerSchema = Yup.object().shape({
    name: Yup.string().min(2).max(40).required('Name is required'),
    tradingName: Yup.string(),
    mainSite: Yup.string(),
    sites: Yup.array(),
    contacts: Yup.array(),
    accountManager: Yup.string().nullable(),
    projectManager: Yup.string().nullable(),
    supportManager: Yup.string().nullable(),
    // site details
    billingSite: Yup.string(),
    // phone: Yup.string(),
    email: Yup.string().trim('The contact name cannot include leading and trailing spaces').email('Email must be a valid email address'),
    // fax: Yup.string(),
    website: Yup.string(),
    street: Yup.string(),
    suburb: Yup.string(),
    city: Yup.string(),
    postcode: Yup.string(),
    region: Yup.string(),
    // country: Yup.string().nullable(true),

    // billing contact details
    billingFirstName: Yup.string(),
    billingLastName: Yup.string(),
    billingTitle: Yup.string(),
    billingContactTypes: Yup.array(),
    // billingContactPhone: Yup.string(),
    billingContactEmail: Yup.string().email('Email must be a valid email address'),

    // technical contact details
    technicalFirstName: Yup.string(),
    technicalLastName: Yup.string(),
    technicalTitle: Yup.string(),
    technicalContactTypes: Yup.array(),
    // technicalContactPhone: Yup.string(),
    technicalContactEmail: Yup.string().email('Email must be a valid email address'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      mainSite: '',
      tradingName: '',
      accountManager: null,
      projectManager: null,
      supportManager: null,
      type: 'Customer',
      isActive: true,
      contactFlag,
      loginUser: {
        userId,
        email: user.email,
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [AddCustomerSchema]
  );

  // console.log('samecheckboxflag', defaultValues.contactFlag);

  const methods = useForm({
    resolver: yupResolver(AddCustomerSchema),
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
    // dispatch(getSPContacts());
  }, [dispatch]);

  const handlePhoneChange = (newValue) => {
    matchIsValidTel(newValue)
    if(newValue.length < 20){
      setPhone(newValue)
    }
  }

  const handleFaxChange = (newValue) => {
    matchIsValidTel(newValue)
    if(newValue.length < 20){
      setFaxVal(newValue)
    }
  }

  const handleBillingContactPhoneChange = (newValue) => {
    matchIsValidTel(newValue)
    if(newValue.length < 20){
      setBillingContactPhone(newValue)
    }
  }

  const handleTechnicalContactPhoneChange = (newValue) => {
    matchIsValidTel(newValue)
    if(newValue.length < 20){
      setTechnicalContactPhone(newValue)
    }
  }

  const onSubmit = async (data) => {
      try{
        if(phone.length > 7){
          data.phone = phone ;
        }
        if(fax.length > 7){
          data.fax = fax
        }
        if(country){
          data.country = country.label
        }
        if(billingContactPhone){
          data.billingContactPhone = billingContactPhone ;
        }
        if(technicalContactPhone){
          data.technicalContactPhone = technicalContactPhone
        }
        dispatch(saveCustomer(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_DASHBOARD.customer.view(null));
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    {/* <Container maxWidth={false}> */}
      {/* <Grid container spacing={3}>
        <CustomerDashboardNavbar/>
      </Grid> */}
      {/* <CustomBreadcrumbs
            heading=" New Customer "
            sx={{ mb: -2, mt: 3 }}
          /> */}
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover name='New Customer' icon="mdi:user"/>
        </Card>
      <Grid item xs={18} md={12} sx={{mt: 3}}>
          <Card sx={{ p: 3, mb: 3 }}>
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
              <RHFTextField name="name" label="Customer Name" />

              <RHFTextField name="tradingName" label="Trading Name" />
              
              {/* <RHFTextField name="phone" label="Phone" /> */}
              <MuiTelInput value={phone} name='phone' label="Phone Number" flagSize="medium"  onChange={handlePhoneChange}  forceCallingCode defaultCountry="NZ"/>
              
              {/* <RHFTextField name="fax" label="Fax" /> */}
              <MuiTelInput value={fax} name='fax' label="Fax" flagSize="medium"  onChange={handleFaxChange} forceCallingCode defaultCountry="NZ"/>


              <RHFTextField name="email" label="Email" />

              <RHFTextField name="website" label="Website" />

              </Box>
              </Stack>
              </Card>
              
              <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Address Information
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

                <RHFTextField name="postcode" label="Post Code" />

                <RHFTextField name="region" label="Region" />

                {/* <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  // getOptionLabel={(option) => option.title}
                  
                  ChipProps={{ size: 'small' }}
                />  */}

                <RHFAutocomplete
                   id="country-select-demo"
                    options={countries}
                    value={country || null}
                    name="country"
                    label="Country"
                    autoHighlight
                    isOptionEqualToValue={(option, value) => option.lable === value.lable}
                    onChange={(event, newValue) => {
                      if(newValue){
                      setCountryVal(newValue);
                      }
                      else{ 
                      setCountryVal("");
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose a country"
                      />
                    )}
                />


              </Box>
              </Stack>
              </Card>

            <Card sx={{ p: 3, mb: 3 }}>
              <Stack spacing={3}>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Billing Contact Information
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
              <RHFTextField name="billingFirstName" label="First Name" />

              <RHFTextField name="billingLastName" label="Last Name" />

              <RHFTextField name="billingTitle" label="Title" />

              {/* <RHFTextField name="billingContactPhone" label="Contact Phone" /> */}
              <MuiTelInput value={billingContactPhone} name="billingContactPhone" label="Contact Phone" flagSize="medium"  onChange={handleBillingContactPhoneChange}  forceCallingCode defaultCountry="NZ"/>
              
              <RHFTextField name="billingContactEmail" label="Contact Email" />

              </Box>

              </Stack>
            </Card>


            <Card component={MotionContainer} sx={{ p: 3, mb: 3 }}>
            <m.div variants={varBounce().in}>

              <Stack spacing={3}>

              <Stack direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={3}>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Technical Contact Information
              </Typography>

              <FormControlLabel label="Same as billing contact" control={<Checkbox checked={contactFlag} onClick={toggleCheckboxFlag} />} sx={{mb: -10}} />
               </Stack>

               {!contactFlag && <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
              <RHFTextField name="technicalFirstName" label="First Name" />

              <RHFTextField name="technicalLastName" label="Last Name" />

              <RHFTextField name="technicalTitle" label="Title" />

              {/* <RHFTextField name="technicalContactPhone" label="Contact Phone" /> */}
              <MuiTelInput value={technicalContactPhone} name="technicalContactPhone" label="Contact Phone" flagSize="medium"  onChange={handleTechnicalContactPhoneChange}  forceCallingCode defaultCountry="NZ"/>
              
              <RHFTextField name="technicalContactEmail" label="Contact Email" />

              </Box>}

              </Stack>
              </m.div>
            </Card>

            <Card sx={{ p: 3 }}>
            <Stack spacing={3}>

              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Howick Resources
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

              <RHFSelect native name="accountManager" label="Account Manager">
                    <option defaultValue value="null" selected >No Account Manager Selected</option>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="projectManager" label="Project Manager">
                    <option defaultValue value="null" selected >No Project Manager Selected</option>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="supportManager" label="Support Manager">
                    <option defaultValue value="null" selected >No Support Manager Selected</option>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              </Box>
              <RHFSwitch name="isActive" labelPlacement="start" label={<Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } />
              </Stack>

            <Stack alignItems="flex-start" direction="row" spacing={2} sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Customer
              </LoadingButton>
            </Stack>
                        
            </Card>
          
          </Grid>
      {/* </Container>  */}
    </FormProvider>
  );
}
