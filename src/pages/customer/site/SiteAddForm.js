import { useEffect,useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput } from 'mui-tel-input';
import { Box,Card, Grid, Stack, Typography } from '@mui/material';
// slice
import { addSite, getSites, setSiteFormVisibility } from '../../../redux/slices/customer/site';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete } from '../../../components/hook-form';
import { SiteSchema } from '../../schemas/customer'

// ----------------------------------------------------------------------

export default function SiteAddForm() {

  const { customer } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [phone, setPhone] = useState('');
  const [fax, setFaxVal] = useState('');

  useEffect(() => {
    dispatch( getActiveContacts(customer?._id))
  }, [ customer, dispatch ] );

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
      country: countries.find((contry)=> contry?.label?.toLocaleLowerCase() === 'New Zealand'.toLocaleLowerCase() ) || null ,
      isArchived: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(SiteSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);



  const onSubmit = async (data) => {
    try {
      if (phone) {
        data.phone = phone;
      }
      if (fax) {
        data.fax = fax;
      }
      await dispatch(addSite(data));
      await dispatch(getSites(customer?._id))
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
                <RHFTextField name="street" label="Street" />
                <RHFTextField name="suburb" label="Suburb" />
                <RHFTextField name="city" label="City" />
                <RHFTextField name="region" label="Region" />
                <RHFTextField name="postcode" label="Post Code" />

                <RHFAutocomplete
                  options={countries}
                  name="country"
                  label="Country"
                  getOptionLabel={(option) => `${option?.label || ''} (${option.code || ''}) `}
                  isOptionEqualToValue={(option, value) => option?.label === value?.label }
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
                <RHFTextField name="lat" label="Latitude" />
                <RHFTextField name="long" label="Longitude" />
                <MuiTelInput
                  value={phone}
                  name="phone"
                  label="Phone Number"
                  flagSize="medium"
                  defaultCountry="NZ"
                  onChange={(newValue)=>setPhone(newValue)}
                  inputProps={{maxLength:13}}
                  forceCallingCode
                />

                <MuiTelInput
                  value={fax}
                  name="fax"
                  label="Fax"
                  flagSize="medium"
                  defaultCountry="NZ"
                  onChange={(newValue)=>setFaxVal(newValue)}
                  inputProps={{maxLength:13}}
                  forceCallingCode
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
                <RHFAutocomplete
                  name='primaryBillingContact'
                  label="Primary Billing Contact" 
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''}`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.firstName || ''} ${option.lastName || ''}`}</li> )}
                />

                <RHFAutocomplete
                  name='primaryTechnicalContact'
                  label="Primary Technical Contact"
                  options={activeContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option.firstName || ''} ${option.lastName || ''}`}</li> )}
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
