import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Card,
  Grid,
  Stack,
  Autocomplete,
  Container,
} from '@mui/material';
// ROUTES
import { PATH_PAGE, PATH_SETTING } from '../../../../routes/paths';
// slice
import { addRole } from '../../../../redux/slices/securityUser/role';

// components
import { useSnackbar } from '../../../../components/snackbar';
// assets
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';

// ----------------------------------------------------------------------
RoleAddForm.propTypes = {
  currentRole: PropTypes.object,
};

export default function RoleAddForm({ currentRole }) {

  const { userRoleTypes } = useSelector((state) => state.role);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // a note can be archived.
  const AddRoleSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name Field is required!'),
    description: Yup.string().max(10000),
    /* eslint-disable */
    roleType:  Yup.object().nullable().required().label('Role Type'),
    /* eslint-enable */
    allModules: Yup.boolean(),
    allWriteAccess: Yup.boolean(),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
    disableDelete: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      name: '',
      roleType: null,
      description: '',
      isActive: true,
      isDefault: false,
      allModules: false,
      allWriteAccess: false,
      disableDelete: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRole]
  );

  const methods = useForm({
    resolver: yupResolver(AddRoleSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await dispatch(addRole(data));
      reset();
      enqueueSnackbar('Role Save Successfully!');
      navigate(PATH_SETTING.role.list);
    } catch ( error ) {
      enqueueSnackbar( error, { variant: `error` });
      console.error( error );
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.role.list);
  };

  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
          // mt: '24px',
        }}
      >
        <Cover name="New Role" />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>

                <RHFTextField name="name" label="Name" />

                <RHFAutocomplete
                  name="roleType" 
                  label="Role Type"
                  options={userRoleTypes}
                  getOptionLabel={(option) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  renderOption={(props, option) => (<li {...props} key={option.key}> {option.name || ''}</li>)}
                />

                <RHFTextField name="description" label="Description" minRows={8} multiline />

                <Grid display="flex" alignItems="end">
                  <RHFSwitch name="isActive" label="Active" />
                  <RHFSwitch name="isDefault" label="Default" />
                  <RHFSwitch name="disableDelete" label="Disable Delete" />
                </Grid>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
