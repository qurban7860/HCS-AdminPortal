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
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import {
  Box,
  Card,
  Grid,
  Stack,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  TextField,
} from '@mui/material';
import { MuiChipsInput } from 'mui-chips-input';
// hooks
import { useSnackbar } from '../../components/snackbar';
// slice
import { addCustomer } from '../../redux/slices/customer/customer';
import { getSPContacts } from '../../redux/slices/customer/contact';
// schema
import { AddCustomerSchema } from './schemas/AddCustomerSchema';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import FormProvider, { RHFAutocomplete, RHFTextField } from '../../components/hook-form';
import { MotionContainer, varBounce } from '../../components/animate';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../components/DocumentForms/ToggleButtons';
import { AddFormLabel } from '../components/DocumentForms/FormLabel';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// asset
import { countries } from '../../assets/data';
// util
import { Cover } from '../components/Defaults/Cover';
import { FORMLABELS } from '../../constants/default-constants';
import { FORMLABELS as formLABELS } from '../../constants/customer-constants';
import { StyledCardContainer } from '../../theme/styles/default-styles';
// ----------------------------------------------------------------------

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {
  const { userId, user } = useAuthContext();
  const { spContacts } = useSelector((state) => state.contact);
  const filteredContacts = spContacts.filter((contact) => contact.isActive === true);
  const [contactFlag, setCheckboxFlag] = useState(false);
  const [chips, setChips] = useState([]);

  const toggleCheckboxFlag = () => setCheckboxFlag((value) => !value);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [phone, setPhone] = useState('');
  const [fax, setFaxVal] = useState('');
  const [country, setCountryVal] = useState('');
  const [billingContactPhone, setBillingContactPhone] = useState('');
  const [technicalContactPhone, setTechnicalContactPhone] = useState('');
  const [accountManVal, setAccountManVal] = useState('');
  const [supportManVal, setSupportManVal] = useState('');
  const [projectManVal, setProjectManVal] = useState('');

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

  // --------------------------------handle functions--------------------------------
  const toggleCancel = () => {
    navigate(PATH_CUSTOMER.list);
  };

  const handlePhoneChange = (newValue) => {
    matchIsValidTel(newValue);
    if (newValue.length < 20) {
      setPhone(newValue);
    }
  };

  const handleFaxChange = (newValue) => {
    matchIsValidTel(newValue);
    if (newValue.length < 20) {
      setFaxVal(newValue);
    }
  };

  const handleBillingContactPhoneChange = (newValue) => {
    matchIsValidTel(newValue);
    if (newValue.length < 20) {
      setBillingContactPhone(newValue);
    }
  };

  const handleTechnicalContactPhoneChange = (newValue) => {
    matchIsValidTel(newValue);
    if (newValue.length < 20) {
      setTechnicalContactPhone(newValue);
    }
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
      dispatch(addCustomer(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_CUSTOMER.view(null));
    } catch (error) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleChipChange = (newChips) => {
    console.log('newChips : ', newChips);
    setChips(newChips);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <StyledCardContainer>
        <Cover name={FORMLABELS.COVER.NEW_CUSTOMER} />
      </StyledCardContainer>
      <Grid sx={{ mt: 3 }}>
        {/* basic information */}
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
              <RHFTextField
                name={formLABELS.CUSTOMER.NAME.name}
                label={formLABELS.CUSTOMER.NAME.label}
              />

              {/* <RHFTextField name="tradingName" label="Trading Name" /> */}
              <MuiChipsInput
                name={formLABELS.CUSTOMER.TRADING_NAME.name}
                label={formLABELS.CUSTOMER.TRADING_NAME.label}
                value={chips}
                onChange={handleChipChange}
              />
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
                name={formLABELS.PHONE.name}
                label={formLABELS.PHONE.label}
                flagSize={formLABELS.PHONE.flagSize}
                onChange={handlePhoneChange}
                forceCallingCode
                defaultCountry={formLABELS.PHONE.defaultCountry}
              />

              {/* <RHFTextField name="fax" label="Fax" /> */}
              <MuiTelInput
                value={fax}
                name={formLABELS.FAX.name}
                label={formLABELS.FAX.label}
                flagSize={formLABELS.FAX.flagSize}
                onChange={handleFaxChange}
                forceCallingCode
                defaultCountry={formLABELS.FAX.defaultCountry}
              />

              <RHFTextField name={formLABELS.EMAIL.name} label={formLABELS.EMAIL.label} />

              <RHFTextField name={formLABELS.WEBSITE.name} label={formLABELS.WEBSITE.label} />
            </Box>
          </Stack>
        </Card>

        {/* address information */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <AddFormLabel content={FORMLABELS.ADDRESS} />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name={formLABELS.STREET.name} label={formLABELS.STREET.label} />
              <RHFTextField name={formLABELS.SUBURB.name} label={formLABELS.SUBURB.label} />
              <RHFTextField name={formLABELS.CITY.name} label={formLABELS.CITY.label} />
              <RHFTextField name={formLABELS.POSTCODE.name} label={formLABELS.POSTCODE.label} />
              <RHFTextField name={formLABELS.REGION.name} label={formLABELS.REGION.label} />

              <RHFAutocomplete
                id={formLABELS.COUNTRY.id}
                options={countries}
                value={country || null}
                name={formLABELS.COUNTRY.name}
                label={formLABELS.COUNTRY.label}
                autoHighlight
                isOptionEqualToValue={(option, value) => option.lable === value.lable}
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
                renderInput={(params) => (
                  <TextField {...params} label={formLABELS.COUNTRY.select} />
                )}
              />
            </Box>
          </Stack>
        </Card>

        {/* billing contact information */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={3}>
            <AddFormLabel content={FORMLABELS.BILLING_CONTACT} />
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField
                name={formLABELS.BILLING_CONTACT.FIRSTNAME.name}
                label={formLABELS.BILLING_CONTACT.FIRSTNAME.label}
              />

              <RHFTextField
                name={formLABELS.BILLING_CONTACT.LASTNAME.name}
                label={formLABELS.BILLING_CONTACT.LASTNAME.label}
              />

              <RHFTextField
                name={formLABELS.BILLING_CONTACT.TITLE.name}
                label={formLABELS.BILLING_CONTACT.TITLE.label}
              />

              {/* <RHFTextField name="billingContactPhone" label="Contact Phone" /> */}
              <MuiTelInput
                value={billingContactPhone}
                name={formLABELS.BILLING_CONTACT.PHONE.name}
                label={formLABELS.BILLING_CONTACT.PHONE.label}
                flagSize={formLABELS.BILLING_CONTACT.PHONE.flagSize}
                onChange={handleBillingContactPhoneChange}
                forceCallingCode
                defaultCountry={formLABELS.BILLING_CONTACT.PHONE.defaultCountry}
              />

              <RHFTextField
                name={formLABELS.BILLING_CONTACT.EMAIL.name}
                label={formLABELS.BILLING_CONTACT.EMAIL.label}
              />
            </Box>
          </Stack>
        </Card>

        {/* technical contact information */}
        <Card component={MotionContainer} sx={{ p: 3, mb: 3 }}>
          <m.div variants={varBounce().in}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
                <AddFormLabel content={FORMLABELS.TECHNICAL_CONTACT} />

                <FormControlLabel
                  label={formLABELS.SAME_AS}
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
                  <RHFTextField
                    name={formLABELS.TECHNICAL_CONTACT.FIRSTNAME.name}
                    label={formLABELS.TECHNICAL_CONTACT.FIRSTNAME.label}
                  />

                  <RHFTextField
                    name={formLABELS.TECHNICAL_CONTACT.LASTNAME.name}
                    label={formLABELS.TECHNICAL_CONTACT.LASTNAME.label}
                  />

                  <RHFTextField
                    name={formLABELS.TECHNICAL_CONTACT.TITLE.name}
                    label={formLABELS.TECHNICAL_CONTACT.TITLE.label}
                  />

                  {/* <RHFTextField name="technicalContactPhone" label="Contact Phone" /> */}
                  <MuiTelInput
                    value={technicalContactPhone}
                    name={formLABELS.TECHNICAL_CONTACT.PHONE.name}
                    label={formLABELS.TECHNICAL_CONTACT.PHONE.label}
                    flagSize={formLABELS.TECHNICAL_CONTACT.PHONE.flagSize}
                    onChange={handleTechnicalContactPhoneChange}
                    forceCallingCode
                    defaultCountry={formLABELS.TECHNICAL_CONTACT.PHONE.defaultCountry}
                  />

                  <RHFTextField
                    name={formLABELS.TECHNICAL_CONTACT.EMAIL.name}
                    label={formLABELS.TECHNICAL_CONTACT.EMAIL.label}
                  />
                </Box>
              )}
            </Stack>
          </m.div>
        </Card>

        {/* howick resources */}
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3, mb: 3 }}>
              <Stack spacing={3}>
                <AddFormLabel content={FORMLABELS.HOWICK} />

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{
                    xs: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                  }}
                  mb={2}
                >
                  <Autocomplete
                    // freeSolo
                    value={accountManVal || null}
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName && option.firstName} ${
                        option.lastName && option.lastName
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
                        {option.firstName && option.firstName} {option.lastName && option.lastName}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={formLABELS.CUSTOMER.ACCOUNT} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={projectManVal || null}
                    options={filteredContacts}
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
                        {option.firstName && option.firstName}
                        {option.lastName && option.lastName}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={formLABELS.CUSTOMER.PROJECT} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                  <Autocomplete
                    // freeSolo
                    value={supportManVal || null}
                    options={filteredContacts}
                    isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
                    getOptionLabel={(option) =>
                      `${option.firstName && option.firstName} ${
                        option.lastName && option.lastName
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
                        {option.firstName && option.firstName}
                        {option.lastName && option.lastName}
                      </li>
                    )}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} label={formLABELS.CUSTOMER.SUPPORT} />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>
                <ToggleButtons name={FORMLABELS.isACTIVE.name} />
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
