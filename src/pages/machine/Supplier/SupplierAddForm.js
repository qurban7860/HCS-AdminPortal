import * as Yup from 'yup';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Typography, Container, TextField } from '@mui/material';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
// slice
import { addSupplier } from '../../../redux/slices/products/supplier';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFSwitch,
} from '../../../components/hook-form';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// asset
import { countries } from '../../../assets/data';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

export default function StatusAddForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [country, setCountryVal] = useState('');
  const [phone, setPhone] = useState('');
  const [fax, setFaxVal] = useState('');
  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required'),
    isActive: Yup.boolean(),
    contactName: Yup.string().max(50),
    contactTitle: Yup.string().max(50),
    // phone: Yup.string().nullable(),
    // fax: Yup.string().nullable(),
    email: Yup.string().email(),
    website: Yup.string(),
    street: Yup.string().max(50),
    suburb: Yup.string().max(50),
    region: Yup.string().max(50),
    // country: Yup.string(),
    city: Yup.string().max(50),
    postcode: Yup.string().max(20),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      contactName: '',
      contactTitle: '',
      // phone: '',
      // fax: '',
      email: '',
      website: '',
      street: '',
      suburb: '',
      region: '',
      // country: '',
      city: '',
      postcode: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.supplier.list);
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
      if (phone && phone.length > 4) {
        data.phone = phone;
      }
      if (fax && fax.length > 4) {
        data.fax = fax;
      }
      if (country) {
        data.country = country.label;
      }
      console.log(data);
      await dispatch(addSupplier(data));
      reset();
      enqueueSnackbar('Create success!');
      navigate(PATH_MACHINE.machines.settings.supplier.list);
    } catch (error) {
      // enqueueSnackbar('Saving failed!');
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  // const { themeStretch } = useSettingsContext();
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="New Supplier" icon="material-symbols:inventory-2-rounded" />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={18} md={12} sx={{ mt: 3 }}>
          <Card sx={{ p: 3, mt: 3 }}>
            <Stack spacing={3}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
                <RHFTextField name="name" label="Name*" />
              </Box>
            </Stack>
          </Card>
          <Card sx={{ p: 3, mt: 3 }}>
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
          <Grid container spacing={3}>
            <Grid item xs={18} md={12}>
              <Card sx={{ p: 3, mt: 3 }}>
                <Stack spacing={3}>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    Address Information
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
                    <RHFTextField name="region" label="Region" />
                    <RHFTextField name="postcode" label="Post Code" />
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
                  <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
