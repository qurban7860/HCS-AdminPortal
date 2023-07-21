import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { Box, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// routes
import { PATH_SETTING } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFMultiSelect } from '../../components/hook-form';
// slice
import {
  updateSecurityUser,
  setSecurityUserEditFormVisibility,
} from '../../redux/slices/securityUser/securityUser';
import { getActiveSPCustomers } from '../../redux/slices/customer/customer';
import { getContacts, getActiveContacts, resetContacts } from '../../redux/slices/customer/contact';
import { getRegion, updateRegion } from '../../redux/slices/region/region';
// current user
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import ViewFormSWitch from '../components/ViewForms/ViewFormSwitch';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function RegionEditForm() {
  const { region, countries } = useSelector((state) => state.region);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const EditRegionSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
    description: Yup.string(),
    countries: Yup.array(),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: region?.name || '',
      description: region?.description || '',
      countries: region?.countries || [],
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = methods;

  const values = watch();

  // useLayoutEffect(() => {
  //   const filteredRole = roleTypesArray.find((x) => x.key === role?.roleType);
  //   if (filteredRole) {
  //     setRoleType(filteredRole);
  //     setValue('roleTypes', filteredRole?.name);
  //   }
  // }, [role, roleTypesArray, setValue]);

  const toggleCancel = () => {
    navigate(PATH_SETTING.region.view(region._id));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateRegion(region._id, data));
      dispatch(getRegion(region._id));
      navigate(PATH_SETTING.regions.view(region._id));
      enqueueSnackbar('Region updated Successfully!');
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
                <RHFTextField name="name" label="Name" />
                <RHFMultiSelect
                  chip
                  checkbox
                  name="countries"
                  label="Countries"
                  options={countries.map((country) => ({
                    value: country._id, // or the appropriate value for each country
                    label: (
                      <>
                      {/* <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }}> */}
                        <Stack direction="row">
                        {/* <img
                          loading="lazy"
                          width="20"
                          height="10"
                          src={`https://flagcdn.com/w20/${country.country_code.toLowerCase()}.png`}
                          srcSet={`https://flagcdn.com/w40/${country.country_code.toLowerCase()}.png 2x`}
                          alt=""
                        /> */}
                         {country.country_name} ({country.country_code})
                         </Stack>
                      {/* </Box> */}
                      </>
                    ),
                  }))}
                />
                {/* <RHFAutocomplete
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
                /> */}
                {/* <RHFTextField name="description" label="Description" /> */}
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
