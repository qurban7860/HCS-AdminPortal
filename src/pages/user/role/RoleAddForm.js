import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField, Container } from '@mui/material';
// ROUTES
import { PATH_DASHBOARD } from '../../../routes/paths';
// slice
import { addRole } from '../../../redux/slices/securityUser/role';

// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import FormHeading from '../../components/FormHeading';
import AddFormButtons from '../../components/AddFormButtons';
import { Cover } from '../../components/Cover';

// ----------------------------------------------------------------------
RoleAddForm.propTypes = {
  currentRole: PropTypes.object,
};
export default function RoleAddForm({ currentRole }) {
  const { role, roles } = useSelector((state) => state.role);

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  // a note can be archived.
  const AddRoleSchema = Yup.object().shape({
    name: Yup.string().min(2).required("Name Field is required!"),
    roleType: Yup.string().required("Role Type is required!"),
    description: Yup.string().max(10000).required("Description is required!"),
    allModules: Yup.boolean(),
    allWriteAccess: Yup.boolean(),
    isActive: Yup.boolean(),
    disableDelete: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      name: '',
      roleType: '',
      description: '',
      isActive: true,
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
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      await dispatch(addRole(data));
      reset();
      enqueueSnackbar('Role Save Successfully!');
      navigate(PATH_DASHBOARD.role.list);
    } catch (error) {
      enqueueSnackbar('Role Save failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_DASHBOARD.role.list);
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
            <Card sx={{ p: 3 }} >
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="roleType" label="Role Type" />
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex" alignItems="end">
                  <RHFSwitch name="isActive" labelPlacement="start" label={
                    <Typography
                      variant="subtitle2"
                      sx={{
                        mx: 0,
                        width: 1,
                        justifyContent: 'space-between',
                        mb: 0.5,
                        color: 'text.secondary'
                      }}> Active
                    </Typography>
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
