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
// import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input'

// slice
import { addCustomer } from '../../redux/slices/customer/customer';
import { getSPContacts } from '../../redux/slices/customer/contact';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
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
import { FORMLABELS } from '../../constants/customer-constants';
import { StyledToggleButtonLabel } from '../../theme/styles/document-styles';
// import { StyledCardContainer } from '../../theme/styles/default-styles';
import FormLabel from '../components/DocumentForms/FormLabel';

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
  const [chips, setChips] = useState([]);

  const toggleCheckboxFlag = () => setCheckboxFlag((value) => !value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [phone, setPhone] = useState('');
  const [fax, setFaxVal] = useState('');
  const [country, setCountryVal] = useState(countries[169]);
  const [billingContactPhone, setBillingContactPhone] = useState('');
  const [technicalContactPhone, setTechnicalContactPhone] = useState('');

  const AddCustomerSchema = Yup.object().shape({
    name: Yup.string().trim('Leading and trailing spaces are not allowed')
    .min(2, 'Name must be at least 2 characters long')
    .max(40, 'Name must not exceed 40 characters')
    .required('Name is required'),
    
    // tradingName: Yup.string(),
    mainSite: Yup.string().trim('Leading and trailing spaces are not allowed'),
    sites: Yup.array(),
    contacts: Yup.array(),
    accountManager: Yup.array(),
    projectManager: Yup.array(),
    supportManager: Yup.array(),
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
      code:'',
      name: '',
      mainSite: '',
      // tradingName: chips   ,
      accountManager: [],
      projectManager: [],
      supportManager: [],
      type: 'Customer',
      isActive: true,
      supportSubscription:true,
      isFinancialCompany: false,
      excludeReports:false,
      contactFlag,
      loginUser: {
        userId,
        email: user.email,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [AddCustomerSchema]
  );

  const methods = useForm({
    resolver: yupResolver(AddCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

    watch();

  useLayoutEffect(() => {
    dispatch(getSPContacts());
  }, [dispatch]);

  
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

      if(contactFlag){
        if (billingContactPhone) data.technicalContactPhone = billingContactPhone;
        data.technicalFirstName = data?.billingFirstName;
        data.technicalLastName = data?.billingLastName;
        data.technicalTitle = data?.billingTitle;
        data.technicalContactEmail = data?.billingContactEmail;
      }

      const response = await dispatch(addCustomer(data));
      
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_CUSTOMER.view(response.data.Customer._id));
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
    }
  };

  const handleChipChange = (newChips) => {
    const array = [...new Set(newChips)]
    setChips(array)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                sm: 'repeat(1, 5fr 1fr)', // First one spans 1 column, and the second spans 5 columns on sm screens
              }}
            >
              <RHFTextField name="name" label={FORMLABELS.CUSTOMER.NAME.label} />
              <RHFTextField name="code" label={FORMLABELS.CUSTOMER.CODE.label} />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              {/* <RHFTextField name="name" label="Customer Name*" /> */}

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
                onChange={(newValue)=> setPhone(newValue)}
                inputProps={{ maxLength: 13 }}
                forceCallingCode
                defaultCountry={country?.code}
              />

              {/* <RHFTextField name="fax" label="Fax" /> */}
              <MuiTelInput
                value={fax}
                name="fax"
                label="Fax"
                flagSize="medium"
                onChange={(newValue) => setFaxVal(newValue)}
                inputProps={{ maxLength: 13 }}
                forceCallingCode
                defaultCountry={country?.code}
              />

              <RHFTextField name="email" label="Email" />

              <RHFTextField name="website" label="Website" />
            </Box>
          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <FormLabel content={FORMLABELS.CUSTOMER.ADDRESSINFORMATION} />
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
            <FormLabel content={FORMLABELS.CUSTOMER.BILLINGCONTACTINFORMATION} />
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
                onChange={(newValue) => setBillingContactPhone(newValue)}
                inputProps={{ maxLength: 13 }}
                forceCallingCode
                defaultCountry={country?.code}
                // onCount
              />

              <RHFTextField name="billingContactEmail" label="Contact Email" />
            </Box>
          </Stack>
        </Card>

        <Card component={MotionContainer} sx={{ p: 3, mb: 3 }}>
          <m.div variants={varBounce().in}>
            <Stack spacing={3}>
                <Grid container direction='row'>
                  <Grid item xs={12} sm={12} md={8} lg={9}>
                    <FormLabel  content={FORMLABELS.CUSTOMER.TECHNICALCONTACTINFORMATION} />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={3}>
                    <FormControlLabel
                      label="Same as billing contact"
                      control={<Checkbox checked={contactFlag} onClick={toggleCheckboxFlag} />}
                      sx={{ ml:1}}
                    />
                  </Grid>
                </Grid>
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
                    onChange={(newValue) => setTechnicalContactPhone(newValue)}
                    inputProps={{ maxLength: 13 }}
                    forceCallingCode
                    defaultCountry={country?.code}
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
                <FormLabel content={FORMLABELS.CUSTOMER.HOWICKRESOURCESS} />
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                >
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="accountManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Account Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />

                  <RHFAutocomplete
                    // freeSolo
                    multiple
                    disableCloseOnSelect
                    name="projectManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Project Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="supportManager"
                    options={spContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Support Manager" />}
                    ChipProps={{ size: 'small' }}
                    id="controllable-states-demo"
                  />
                </Box>
                <Grid sx={{display:{md:'flex'}}}>
                    <RHFSwitch name="isActive" label="Active" checked={defaultValues?.isActive} />
                    <RHFSwitch name="supportSubscription" label='Support Subscription' checked={defaultValues?.supportSubscription} />
                    <RHFSwitch name="isFinancialCompany" label="Financing Company" defaultChecked={defaultValues?.isFinancialCompany} />
                    <RHFSwitch name="excludeReports" label="Exclude Reporting" defaultChecked={defaultValues?.excludeReports} />
                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
