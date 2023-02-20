import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// slice
import { saveSite, setFormVisibility } from '../../redux/slices/site';
// components
import { useSnackbar } from '../../components/snackbar';
// assets
import { countries } from '../../assets/data';


import FormProvider, {
  RHFSelect,
  RHFTextField,
} from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function SiteAddForm() {

  const { formVisibility } = useSelector((state) => state.site);

  const { customer } = useSelector((state) => state.customer);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();


  const AddSiteSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required'),
    customer: Yup.string(),
    billingSite: Yup.string(),
    phone: Yup.string(),
    email: Yup.string(),
    fax: Yup.string(),
    website: Yup.string(),
    street: Yup.string(),
    suburb: Yup.string(),
    city: Yup.string(),
    region: Yup.string(),
    country: Yup.string(),

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
      country: '',
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
    if (!formVisibility) {
      dispatch(setFormVisibility(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);


  const onSubmit = async (data) => {
    try {
      await dispatch(saveSite(data));
      reset();

    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(err);
    }
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

                <RHFSelect native name="country" label="Country" placeholder="Country">
                  <option value="" />
                  {countries.map((country) => (
                    <option key={country.code} value={country.label}>
                      {country.label}
                    </option>
                  ))}
                </RHFSelect>

              </Box>
            </Stack>



            <Stack alignItems="flex-start" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Site
              </LoadingButton>
            </Stack>

          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}
