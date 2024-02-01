import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack } from '@mui/material';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete } from '../../../../components/hook-form';
// slice
import { getRegion, updateRegion,  getCountries } from '../../../../redux/slices/region/region';
// current user
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { regionSchema } from '../../../schemas/setting';


// ----------------------------------------------------------------------

export default function RegionEditForm() {
  const { region, countries } = useSelector((state) => state.region);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  useLayoutEffect(() => {
    dispatch(getCountries());
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      name: region?.name || '',
      countries: region.countries || [],
      description: region?.description || '',
      isActive: region?.isActive || false,
      isDefault: region?.isDefault || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(regionSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  watch();

  const toggleCancel = () => {
    navigate(PATH_SETTING.regions.view(region._id));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateRegion(data, region._id));
      dispatch(getRegion(region._id));
      enqueueSnackbar('Region updated Successfully!');
      navigate(PATH_SETTING.regions.view(region._id));
      reset();
    } catch (err) {
      enqueueSnackbar('Region Updating failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
       <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" required/>
                <RHFAutocomplete
                  multiple
                  filterSelectedOptions
                  disableCloseOnSelect
                  name="countries"
                  label="Countries"
                  id="countries-autocomplete"
                  options={countries}
                  getOptionLabel={(option) => `(${option.country_code}) ${option.country_name}` }
                  isOptionEqualToValue={(option, value) => option?.country_name === value?.country_name }
                />
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex" alignItems="end">
                  <RHFSwitch name="isActive" label="Active" />
                  <RHFSwitch name="isDefault" label="Default" />
                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}
