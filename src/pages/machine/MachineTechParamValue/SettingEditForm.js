import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// slice
import { updateSite, setEditFormVisibility } from '../../../redux/slices/customer/site';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';

import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,

} from '../../../components/hook-form';

import { countries } from '../../../assets/data';

// ----------------------------------------------------------------------

export default function SettingEditForm() {

  const { error, site } = useSelector((state) => state.site);

  const { contacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const EditSiteSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required'),
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
      id: site?._id || '',
      name: site?.name || '',
      customer: site?.customer || '',
      billingSite: site?.billingSite || '',
      phone: site?.phone || '',
      email: site?.email || '',
      fax: site?.fax || '',
      website: site?.website || '',
      street: site?.address?.street || '',
      suburb: site?.address?.suburb || '',
      city: site?.address?.city || '',
      region: site?.address?.region || '',
      country: site.address?.country === null || site.address?.country === undefined  ? null : site.address.country,
      primaryBillingContact: site.primaryBillingContact === null || site.primaryBillingContact === undefined  ? null : site.primaryBillingContact,
      primaryTechnicalContact: site.primaryTechnicalContact === null || site.primaryTechnicalContact === undefined  ? null : site.primaryTechnicalContact,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [site]
  );

  const methods = useForm({
    resolver: yupResolver(EditSiteSchema),
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
    if (site) {
      reset(defaultValues);
    }
  }, [site, reset, defaultValues]);

  const toggleCancel = () => 
  {
    dispatch(setEditFormVisibility(false));
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      await dispatch(updateSite(data));
      reset();
    } catch (err) {
      enqueueSnackbar('Saving failed!');
      console.error(error);
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
                columnGap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  // getOptionLabel={(option) => option.title}
                  
                  ChipProps={{ size: 'small' }}
                />

                <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  // getOptionLabel={(option) => option.title}
                  
                  ChipProps={{ size: 'small' }}
                />
                <RHFTextField name="techParamValue" label="Technical Parameter Value" />
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

              <LoadingButton 
                type="submit"
                variant="contained"
                size="large"
                loading={isSubmitting}>
                  Save Changes
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
