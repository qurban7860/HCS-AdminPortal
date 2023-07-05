import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Switch, Box, Card, Grid, Stack, Typography, Button, TextField } from '@mui/material';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
// global
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../../components/hook-form';
import { CONFIG } from '../../../config-global';
// slice
import {
  updateSupplier,
  setSupplierEditFormVisibility,
  getSuppliers,
  getSupplier,
} from '../../../redux/slices/products/supplier';
import { useSettingsContext } from '../../../components/settings';
// routes
import { PATH_MACHINE, PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { countries } from '../../../assets/data';
import { Cover } from '../../components/Defaults/Cover';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function SupplierEditForm() {
  const { error, supplier } = useSelector((state) => state.supplier);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [country, setCountryVal] = useState('');
  const [phone, setPhone] = useState('');
  const [fax, setFaxVal] = useState('');
  const { id } = useParams();

  const EditCategorySchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name is required'),
    isActive: Yup.boolean(),
    contactName: Yup.string(),
    contactTitle: Yup.string(),
    // phone: Yup.string().nullable(),
    // fax: Yup.string().nullable(),
    email: Yup.string().email(),
    website: Yup.string(),
    street: Yup.string(),
    suburb: Yup.string(),
    region: Yup.string(),
    city: Yup.string(),
    postcode: Yup.string(),
    // country: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      name: supplier?.name || '',
      contactName: supplier?.contactName || '',
      contactTitle: supplier?.contactTitle || '',
      // phone: supplier?.phone || '',
      // fax: supplier?.fax || '',
      email: supplier?.email || '',
      website: supplier?.website || '',
      street: supplier?.address?.street || '',
      suburb: supplier?.address?.suburb || '',
      city: supplier?.address?.city || '',
      postcode: supplier?.address?.postcode || '',
      region: supplier?.address?.region || '',
      // country: supplier?.address?.country || '',
      isActive: supplier.isActive || true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [supplier]
  );

  const { themeStretch } = useSettingsContext();

  const methods = useForm({
    resolver: yupResolver(EditCategorySchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  function filtter(data, input) {
    const filteredOutput = data.filter((obj) =>
      Object.keys(input).every((filterKeys) => obj[filterKeys] === input[filterKeys])
    );
    return filteredOutput;
  }
  useLayoutEffect(() => {
    dispatch(getSupplier(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (supplier) {
      setPhone(supplier.phone);
      setFaxVal(supplier.fax);
      const supplierCountry = filtter(countries, { label: supplier?.address?.country || '' });
      setCountryVal(supplierCountry[0]);
    }
  }, [supplier]);

  useEffect(() => {
    if (supplier) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  const toggleCancel = () => {
    // dispatch(setSupplierEditFormVisibility(false));
    navigate(PATH_MACHINE.machines.settings.supplier.view(id));
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

  const onSubmit = async (data) => {
    try {
      console.log(typeof phone);
      if (phone && phone.length > 7) {
        data.phone = phone;
      } else {
        data.phone = '';
      }
      if (fax && fax.length > 7) {
        data.fax = fax;
      } else {
        data.fax = '';
      }
      if (country) {
        data.country = country.label;
      } else {
        data.country = '';
      }
      console.log(data);
      await dispatch(updateSupplier(data, id));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_MACHINE.machines.settings.supplier.view(id));
    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
            <Cover name="Edit Supplier" icon="material-symbols:inventory-2-rounded" />
          </Card>
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
                <RHFTextField name="name" label="Name" />
              </Box>
            </Stack>
          </Card>
          <Card sx={{ p: 3, mb: 3 }}>
            <Stack spacing={3}>
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                Contact Information
              </Typography>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="contactName" label="Contact Name" />
                <RHFTextField name="contactTitle" label="Contact Title" />
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
              <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                {' '}
                Address Information{' '}
              </Typography>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFTextField name="street" label="Street" />
                <RHFTextField name="suburb" label="Suburb" />
                <RHFTextField name="city" label="City" />
                <RHFTextField name="postcode" label="Post Code" />
                <RHFTextField name="region" label="Region" />
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
