import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, useLayoutEffect } from 'react';
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
import { getRoles } from '../../../../redux/slices/securityUser/role';
import { addRegion, getCountries } from '../../../../redux/slices/region/region';
// current user
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { regionSchema } from '../../../schemas/setting';

// ----------------------------------------------------------------------

RegionAddForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function RegionAddForm({ isEdit = false, currentUser }) {

  const { roles } = useSelector((state) => state.role);
  const { countries } = useSelector((state) => state.region);
  const [sortedRoles, setSortedRoles] = useState([]);

  const ROLES = [];

  roles.map((role) => ROLES.push({ value: role?._id, label: role.name }));

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    dispatch(getCountries());
    dispatch(getRoles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const mappedRoles = roles.map((role) => ({
      value: role?._id,
      label: role.name,
    }));

    const sortedRolesTemp = [...mappedRoles].sort((a, b) => {
      const nameA = a.label.toUpperCase();
      const nameB = b.label.toUpperCase();
      return nameA.localeCompare(nameB);
    });
    setSortedRoles(sortedRolesTemp);
  }, [roles]);

  const defaultValues = useMemo(
    () => ({
      name: '',
      isActive: true,
      isDefault: false,
      countries: [],
      description: ''
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver( regionSchema ),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(addRegion(data));
      // await dispatch(resetContacts());
      reset();
      navigate(PATH_SETTING.regions.view(response.data.Region._id));
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => { navigate(PATH_SETTING.regions.list) };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name*" />
                <RHFAutocomplete
                  multiple
                  filterSelectedOptions
                  disableCloseOnSelect
                  name="countries"
                  label="Countries"
                  id="countries-autocomplete"
                  options={countries}
                  getOptionLabel={(option) =>  `(${option.country_code}) ${option.country_name}` }
                  isOptionEqualToValue={(option, value) => option?.country_name === value?.country_name }
                />
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex" alignItems="end">
                  <RHFSwitch name="isActive" label="Active" />
                  <RHFSwitch name="isDefault" label="Default" />
                </Grid>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}
