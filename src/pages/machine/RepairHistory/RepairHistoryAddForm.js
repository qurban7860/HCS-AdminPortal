import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
// slice
import { saveSite, setFormVisibility } from '../../../redux/slices/customer/site';
// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';


import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function RepairHistoryAddForm() {

  const { siteAddFormVisibility } = useSelector((state) => state.site);

  const { customer } = useSelector((state) => state.customer);

  const { contacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();


  const AddSiteSchema = Yup.object().shape({
    name: Yup.string().min(2).max(40).required('Name is required'),
    customer: Yup.string(),
    billingSite: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().trim('The contact name cannot include leading and trailing spaces'),
    fax: Yup.string(),
    website: Yup.string(),
    street: Yup.string(),
    suburb: Yup.string(),
    city: Yup.string(),
    region: Yup.string(),
    country: Yup.string().nullable(),
    primaryBillingContact: Yup.string().nullable(),
    primaryTechnicalContact: Yup.string().nullable(),

  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      customer: customer._id,
      billingSite: '',
      phone: '',
      email: '',
      fax: '',
      website: '',
      street: '',
      suburb: '',
      city: '',
      region: '',
      country: null,
      isArchived: false,

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
    console.log('value----->',value);
  };

  const onSubmit = async (data) => {
    try {
      console.log('params',data);
      await dispatch(saveSite(data));
      reset();

    } catch (err) {
      enqueueSnackbar('Saving failed!', { variant: `error` });
      console.error(err.message);
    }
  };


  const toggleCancel = () => 
  {
    dispatch(setFormVisibility(false));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
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
                <RHFTextField name="name" label="Name" />

                <RHFTextField name="phone" label="Phone" />

                <RHFTextField name="email" label="Email" />

                <RHFTextField name="fax" label="Fax" />

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

                {/* <RHFSelect native name="country" label="Country" placeholder="Country">
                  <option defaultValue value="null" selected >No Country Selected</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.label}>
                      {country.label}
                    </option>
                  ))}
                </RHFSelect> */}
                <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  // getOptionLabel={(option) => option.title}
                  
                  ChipProps={{ size: 'small' }}
                />

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
              <RHFSelect onChange={onChange} native name="primaryBillingContact" label="Primary Billing Contact">
                    <option defaultValue value="null" selected >No Primary Billing Contact Selected</option>
                    { 
                    contacts.length > 0 && contacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="primaryTechnicalContact" label="Primary Technical Contact">
                    <option defaultValue value="null" selected >No Primary Technical Contact Selected</option>
                    { 
                    contacts.length > 0 && contacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              </Box>

              <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              > 
              
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Site
                </LoadingButton>
              
                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>


            </Box>
            </Stack>

            

          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}
