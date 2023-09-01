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
import { MuiTelInput } from 'mui-tel-input';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Checkbox,
  Container,
  FormControlLabel,
  Autocomplete,
  DialogTitle,
  Dialog,
  InputAdornment,
  TextField,
} from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input'

// slice
import { addCustomer } from '../../redux/slices/customer/customer';
import { getSPContacts } from '../../redux/slices/customer/contact';
// routes
import { PATH_CUSTOMER, PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
} from '../../components/hook-form';
import { MotionContainer, varBounce } from '../../components/animate';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// asset
import { countries } from '../../assets/data';
// util
import { Cover } from '../components/Defaults/Cover';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import { StyledCardContainer } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object
}

export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {
  const { userId, user } = useAuthContext();

  const { spContacts } = useSelector((state) => state.contact);

  const [contactFlag, setCheckboxFlag] = useState(false);
  const [chips, setChips] = useState([])

  const toggleCheckboxFlag = () => setCheckboxFlag((value) => !value);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const numberRegExp = /^[0-9]+$/;

  const [phone, setPhone] = useState('');
  const [fax, setFaxVal] = useState('');
  const [country, setCountryVal] = useState('');
  const [billingContactPhone, setBillingContactPhone] = useState('');
  const [technicalContactPhone, setTechnicalContactPhone] = useState('');
  const [accountManVal, setAccountManVal] = useState('');
  const [supportManVal, setSupportManVal] = useState('');
  const [projectManVal, setProjectManVal] = useState('');

  const AddCustomerSchema = Yup.object().shape({
    name: Yup.string().trim('Leading and trailing spaces are not allowed')
    .min(2, 'Name must be at least 2 characters long')
    .max(40, 'Name must not exceed 40 characters')
    .required('Name is required'),
    
    // tradingName: Yup.string(),
    mainSite: Yup.string().trim('Leading and trailing spaces are not allowed'),
    sites: Yup.array(),
    contacts: Yup.array(),
    accountManager: Yup.string().nullable(),
    projectManager: Yup.string().nullable(),
    supportManager: Yup.string().nullable(),
    // site details
    billingSite: Yup.string().trim('Leading and trailing spaces are not allowed'),
    // phone: Yup.string(),
    email: Yup.string()
      .trim('The contact name cannot include leading and trailing spaces')
      .email('Email must be a valid email address'),
    // fax: Yup.string(),
    website: Yup.string().trim('Leading and trailing spaces are not allowed'),
    street: Yup.string().trim('Leading and trailing spaces are not allowed'),
    suburb: Yup.string().trim('Leading and trailing spaces are not allowed'),
    city: Yup.string().trim('Leading and trailing spaces are not allowed'),
    postcode: Yup.string().trim('Leading and trailing spaces are not allowed'),
    region: Yup.string().trim('Leading and trailing spaces are not allowed'),
    // country: Yup.string().nullable(true),

    // billing contact details
    billingFirstName: Yup.string().trim('Leading and trailing spaces are not allowed'),
    billingLastName: Yup.string().trim('Leading and trailing spaces are not allowed'),
    billingTitle: Yup.string().trim('Leading and trailing spaces are not allowed'),
    billingContactTypes: Yup.array(),
    // billingContactPhone: Yup.string(),
    billingContactEmail: Yup.string().email('Email must be a valid email address').trim('Leading and trailing spaces are not allowed'),

    // technical contact details
    technicalFirstName: Yup.string().trim('Leading and trailing spaces are not allowed'),
    technicalLastName: Yup.string().trim('Leading and trailing spaces are not allowed'),
    technicalTitle: Yup.string().trim('Leading and trailing spaces are not allowed'),
    technicalContactTypes: Yup.array(),
    // technicalContactPhone: Yup.string(),
    technicalContactEmail: Yup.string().email('Email must be a valid email address').trim('Leading and trailing spaces are not allowed'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      mainSite: '',
      // tradingName: chips   ,
      // accountManager: null,
      // projectManager: null,
      // supportManager: null,
      type: 'Customer',
      isActive: true,
      contactFlag,
      loginUser: {
        userId,
        email: user.email,
      },
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
    dispatch(getSPContacts());
  }, [dispatch]);

  const handlePhoneChange = (newValue) => {
    if(newValue.length < 17){
      setPhone(newValue);
    }
  };

  const handleFaxChange = (newValue) => {
    if(newValue.length < 17){
      setFaxVal(newValue);
    }
  };

  const handleBillingContactPhoneChange = (newValue) => {
      setBillingContactPhone(newValue);
  };

  const handleTechnicalContactPhoneChange = (newValue) => {
      setTechnicalContactPhone(newValue);
  };
  const toggleCancel = () => {
    navigate(PATH_CUSTOMER.list);
  };

  const onSubmit = async (data) => {
    try {
      if (phone && phone.length > 4) {
        data.phone = phone;
      }
      if (chips && chips.length > 0) {
        data.tradingName = chips;
      }
      if (fax && fax.length > 4) {
        data.fax = fax;
      }
      if (country) {
        data.country = country.label;
      }
      if (billingContactPhone) {
        data.billingContactPhone = billingContactPhone;
      }
      if (technicalContactPhone) {
        data.technicalContactPhone = technicalContactPhone;
      }
      if (accountManVal) {
        data.accountManager = accountManVal._id;
      }
      if (projectManVal) {
        data.projectManager = projectManVal._id;
      }
      if (supportManVal) {
        data.supportManager = supportManVal._id;
      }
      // console.log('customer : ', data);
      const response = await dispatch(addCustomer(data));
      
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_CUSTOMER.view(response.data.Customer._id));
    } catch (error) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setChips(array)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
        }}
      >
        <Cover name="New Customer" icon="mdi:user" />
      </Card>
      <Grid sx={{ mt: 3 }}>
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Customer Name*" />

              {/* <RHFTextField name="tradingName" label="Trading Name" /> */}
              <MuiChipsInput name="tradingName" label="Trading Name"  value={chips} onChange={handleChipChange} />
              </Box>
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
                onChange={handlePhoneChange}
                forceCallingCode
                defaultCountry="NZ"
              />

              {/* <RHFTextField name="fax" label="Fax" /> */}
              <MuiTelInput
                value={fax}
                name="fax"
                label="Fax"
                flagSize="medium"
                onChange={handleFaxChange}
                forceCallingCode
                defaultCountry="NZ"
              />

              <RHFTextField name="email" label="Email" />

              <RHFTextField name="website" label="Website" />
            </Box>
          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
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
            </Box>
          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
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
              <MuiTelInput
                value={billingContactPhone}
                name="billingContactPhone"
                label="Contact Phone"
                flagSize="medium"
                onChange={handleBillingContactPhoneChange}
                forceCallingCode
                defaultCountry="NZ"
              />

              <RHFTextField name="billingContactEmail" label="Contact Email" />
            </Box>
          </Stack>
        </Card>

        <Card component={MotionContainer} sx={{ p: 3, mb: 3 }}>
          <m.div variants={varBounce().in}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                  Technical Contact Information
                </Typography>

                <FormControlLabel
                  label="Same as billing contact"
                  control={<Checkbox checked={contactFlag} onClick={toggleCheckboxFlag} />}
                  sx={{ mb: -10 }}
                />
              </Stack>

              {!contactFlag && (
                <Box
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
                  <MuiTelInput
                    value={technicalContactPhone}
                    name="technicalContactPhone"
                    label="Contact Phone"
                    flagSize="medium"
                    onChange={handleTechnicalContactPhoneChange}
                    forceCallingCode
                    defaultCountry="NZ"
                  />

                  <RHFTextField name="technicalContactEmail" label="Contact Email" />
                </Box>
              )}
            </Stack>
          </m.div>
        </Card>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
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
                  <Autocomplete
                    // freeSolo
                    value={accountManVal || null}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setAccountManVal(newValue);
                      } else {
                        setAccountManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.firstName ? option.firstName : ''}{' '}
                        {option.lastName ? option.lastName : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Account Manager" />}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={projectManVal || null}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setProjectManVal(newValue);
                      } else {
                        setProjectManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.firstName ? option.firstName : ''}{' '}
                        {option.lastName ? option.lastName : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Project Manager" />}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={supportManVal || null}
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName ? option.firstName : ''} ${
                        option.lastName ? option.lastName : ''
                      }`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setSupportManVal(newValue);
                      } else {
                        setSupportManVal('');
                      }
                    }}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.firstName ? option.firstName : ''}{' '}
                        {option.lastName ? option.lastName : ''}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
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
      </Grid>
    </FormProvider>
  );
}
