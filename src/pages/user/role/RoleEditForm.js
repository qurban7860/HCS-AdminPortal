import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link, Autocomplete, TextField, Container } from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// slice
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import Iconify from '../../../components/iconify';
import FormProvider, {
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch
} from '../../../components/hook-form';
import { getRole, updateRole } from '../../../redux/slices/securityUser/role';
import AddFormButtons from '../../components/AddFormButtons';
import FormHeading from '../../components/FormHeading';
import { Cover } from '../../components/Cover';


// ----------------------------------------------------------------------

export default function DocumentCategoryeEditForm() {

  const { role } = useSelector((state) => state.role);

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const EditRoleSchema = Yup.object().shape({
    name: Yup.string().min(2).required("Name Field is required!"),
    roleType: Yup.string().required("Role Type is required!"),
    description: Yup.string().max(10000),
    allModules: Yup.boolean(),
    allWriteAccess: Yup.boolean(),
    isActive: Yup.boolean(),
    disableDelete: Yup.boolean(),
  });


  const defaultValues = useMemo(
    () => ({
      name: role?.name || '',
      description: role?.description || '',
      roleType: role?.roleType || '',
      isActive: role?.isActive || false,
      allModules: role?.allModules || false,
      allWriteAccess: role?.allWriteAccess || false,
      disableDelete: role?.disableDelete || false
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditRoleSchema),
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

  // useEffect(() => {
  //   if (site) {
  //     reset(defaultValues);
  //   }
  // }, [site, reset, defaultValues]);

  const toggleCancel = () => {
    navigate(PATH_DASHBOARD.role.view(role._id))

  };

  const onSubmit = async (data) => {
    try {
      await dispatch(updateRole(role._id, data));
      dispatch(getRole(role._id));
      navigate(PATH_DASHBOARD.role.view(role._id))
      enqueueSnackbar('Role updated Successfully!');
      reset();
    } catch (err) {
      enqueueSnackbar('Role Updating failed!', { variant: `error` });
      console.error(err.message);
    }
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
        <Cover name={role?.name} />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormHeading heading='Edit Role' />
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="roleType" label="Role Type" />
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex">
                  <RHFSwitch
                    name="isActive"
                    labelPlacement="start"
                    label={
                      <>
                        <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}>
                          Active
                        </Typography>
                      </>
                    } />
                  <RHFSwitch name="allModules" labelPlacement="start" label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary'
                      }}> All Modules
                    </Typography>
                  } />
                  <RHFSwitch name="allWriteAccess" labelPlacement="start" label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary'
                      }}> All Write Access
                    </Typography>
                  } />
                  <RHFSwitch name="disableDelete" labelPlacement="start" label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary'
                      }}> Disable Delete
                    </Typography>
                  } />

                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>

          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
