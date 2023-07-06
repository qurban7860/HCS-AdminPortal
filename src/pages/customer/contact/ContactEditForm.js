import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, TextField } from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// slice
import {
  updateContact,
  setContactEditFormVisibility,
  resetContact,
  getContacts,
  getContact
} from '../../../redux/slices/customer/contact';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';

import FormProvider, {
  RHFAutocomplete,
  RHFSelect,
  RHFMultiSelect,
  RHFUpload,
  RHFTextField,
  RHFSwitch,
} from '../../../components/hook-form';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../components/AddFormButtons';

// ----------------------------------------------------------------------

const CONTACT_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'financial', label: 'Financial' },
  { value: 'support', label: 'Support' },
];

ContactEditForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentAsset: PropTypes.object,
};

export default function ContactEditForm({ isEdit, readOnly, currentAsset }) {
  const { contact, isLoading, error } = useSelector((state) => state.contact);

  const { customer } = useSelector((state) => state.customer);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const [phone, setPhone] = useState('');
  const [country, setCountryVal] = useState('');

  function filtter(data, input) {
    const filteredOutput = data.filter((obj) =>
      Object.keys(input).every((filterKeys) => obj[filterKeys] === input[filterKeys])
    );
    return filteredOutput;
  }

  useEffect(() => {
    if (contact?.address?.country) {
      setPhone(contact.phone);
      const contactCountry = filtter(countries, { label: contact.address.country });
      setCountryVal(contactCountry[0]);
    }
  }, [contact]);

  const EditContactSchema = Yup.object().shape({
    // customer: Yup.string(),
    firstName: Yup.string().max(40).required(),
    lastName: Yup.string().max(40),
    title: Yup.string(),
    contactTypes: Yup.array(),
    // phone: Yup.string(),
    email: Yup.string()
      .trim('The contact name cannot include leading and trailing spaces')
      .email('Email must be a valid email address'),
    street: Yup.string(),
    suburb: Yup.string(),
    city: Yup.string(),
    region: Yup.string(),
    postcode: Yup.string(),
    isActive: Yup.boolean(),
    // country: Yup.string().nullable()
    // isPrimary: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      id: contact?._id || '',
      customer: contact?.customer || '',
      firstName: contact?.firstName || '',
      lastName: contact?.lastName || '',
      title: contact?.title || '',
      contactTypes: contact?.contactTypes || [],
      // phone: contact?.phone || '',
      email: contact?.email || '',
      street: contact?.address?.street || '',
      suburb: contact?.address?.suburb || '',
      city: contact?.address?.city || '',
      region: contact?.address?.region || '',
      postcode: contact?.address?.postcode || '',
      isActive: contact?.isActive,
      // country: contact.address?.country === null || contact.address?.country === undefined  ? null : contact.address.country,
    }),
    [contact]
  );

  const methods = useForm({
    resolver: yupResolver(EditContactSchema),
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

  useEffect(() => {
    if (contact) {
      reset(defaultValues);
    }
  }, [contact, reset, defaultValues]);

  const handlePhoneChange = (newValue) => {
    matchIsValidTel(newValue);
    if (newValue.length < 20) {
      setPhone(newValue);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (phone && phone.length > 4) {
        data.phone = phone;
      } else {
        data.phone = '';
      }
      if (country) {
        data.country = country.label;
      } else {
        data.country = '';
      }
      await dispatch(updateContact(customer._id, data));
      reset();
      dispatch(setContactEditFormVisibility(false));
      dispatch(resetContact())
      dispatch(getContacts(customer._id));
      dispatch(getContact(customer._id, contact._id));

      enqueueSnackbar('Contact updated Successfully!');
    } catch (err) {
      enqueueSnackbar('Update failed!',{variant:"error"});
      console.error(err);
    }
  };

  const toggleCancel = () => {
    dispatch(setContactEditFormVisibility(false));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container direction="column">
        <Grid item sm={12} lg={12}>
          <Card sx={{ p: 3 }}>
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
                <RHFTextField name="firstName" label="First Name" />

                <RHFTextField name="lastName" label="Last Name" />

                <RHFTextField name="title" label="Title" />

                <RHFMultiSelect
                  chip
                  checkbox
                  name="contactTypes"
                  label="Contact Types"
                  options={CONTACT_TYPES}
                />

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

                <RHFTextField name="email" label="Email" />
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

                {/* <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  // getOptionLabel={(option) => option.title}

                  ChipProps={{ size: 'small' }}
                /> */}

                <RHFAutocomplete
                  id="country-select-demo"
                  options={countries}
                  value={country || null}
                  name="country"
                  label="Country"
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
                  renderInput={(params) => <TextField {...params} label="Choose a country" />}
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
