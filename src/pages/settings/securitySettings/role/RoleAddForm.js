import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Container } from '@mui/material';
// ROUTES
import { PATH_SETTING } from '../../../../routes/paths';
// slice
import { addRole } from '../../../../redux/slices/securityUser/role';
// components
import { useSnackbar } from '../../../../components/snackbar';
// assets
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------
RoleAddForm.propTypes = {
  currentRole: PropTypes.object,
};

export default function RoleAddForm({ currentRole }) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [userRoleTypes, setUserRoleTypes] = useState([])

  const AddRoleSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name Field is required!'),
    description: Yup.string().max(10000),
    roleType: Yup.string().nullable().required().label('Role Type'),
    allModules: Yup.boolean(),
    allWriteAccess: Yup.boolean(),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
    disableDelete: Yup.boolean(),
  });

  useEffect(() => {
    const configurations = JSON.parse(localStorage.getItem('configurations'));
    const roleTypes = configurations.find((c) => c?.name?.trim() === 'userRoleTypes')?.value?.split(',')?.map(r => r?.trim());
    if (Array.isArray(roleTypes)) {
      setUserRoleTypes(roleTypes)
    }
  }, [setUserRoleTypes])

  const defaultValues = useMemo(
    () => ({
      name: '',
      roleType: '',
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await dispatch(addRole(data));
      reset();
      enqueueSnackbar('Role Save Successfully!');
      navigate(PATH_SETTING.role.list);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => navigate(PATH_SETTING.role.list);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="New Role" />
      </StyledCardContainer>
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
