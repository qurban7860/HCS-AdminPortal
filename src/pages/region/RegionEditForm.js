import * as Yup from 'yup';
import { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
// routes
import { PATH_SETTING } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField } from '../../components/hook-form';
// slice
import { getRegion, updateRegion } from '../../redux/slices/region/region';
// current user
import AddFormButtons from '../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function RegionEditForm() {
  const { region, countries } = useSelector((state) => state.region);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  /* eslint-disable */
  useLayoutEffect(() => {
    setSelectedCountries(region?.countries);
  }, [dispatch]);
  /* eslint-enable */


  const EditRegionSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
    description: Yup.string(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: region?.name || '',
      description: region?.description || '',
      isActive: region?.isActive || false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditRegionSchema),
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
      if(selectedCountries.length > 0){
        const selectedCountriesIDs = selectedCountries.map((country) => country._id);
        data.selectedCountries = selectedCountriesIDs;
      }else{
        data.selectedCountries = [];
      }
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

  const handleCountriesChange = (event, selectedOptions) => {
    setSelectedCountries(selectedOptions);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
       <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" required/>
                <Autocomplete
                  multiple
                  id="countries-autocomplete"
                  options={countries}
                  value={selectedCountries}
                  onChange={handleCountriesChange}
                  getOptionLabel={(option) => 
                    `(${option.country_code}) ${option.country_name}`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Countries"
                      placeholder="Select countries"
                    />
                  )}
                />
                {/* <RHFMultiSelect
                  chip
                  checkbox
                  name="countries"
                  label="Countries"
                  options={countries.map((country) => ({
                    value: country._id, // or the appropriate value for each country
                    label: (
                      <>
                        <Stack direction="row">
                          {country.country_name} ({country.country_code})
                         </Stack>
                      </>
                    ),
                  }))}
                /> */}
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex" alignItems="end">
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
                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}
