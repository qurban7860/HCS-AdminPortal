import * as Yup from 'yup';
import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Container } from '@mui/material';
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete } from '../../../../components/hook-form';
import { getRole, updateRole } from '../../../../redux/slices/securityUser/role';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function RoleEditForm() {

  const { role } = useSelector((state) => state.role);;
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [userRoleTypes, setUserRoleTypes] = useState([])

  const EditRoleSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name Field is required!'),
    description: Yup.string().max(10000),
    roleType: Yup.string().required('Role Type'),
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
      name: role?.name || '',
      roleType: userRoleTypes.find((uRole) => uRole.value === role.roleType) || null,
      description: role?.description || '',
      isActive: role?.isActive || false,
      isDefault: role?.isDefault || false,
      allModules: role?.allModules || false,
      allWriteAccess: role?.allWriteAccess || false,
      disableDelete: role?.disableDelete || false,
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
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => navigate(PATH_SETTING.role.view(role._id));

  const onSubmit = async (data) => {
    try {
      await dispatch(updateRole(role._id, data));
      dispatch(getRole(role._id));
      navigate(PATH_SETTING.role.view(role._id));
      enqueueSnackbar('Role updated Successfully!');
      reset();
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.error(err);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={role?.name} />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>

                <RHFTextField name="name" label="Name*" />

                <RHFAutocomplete
                  name="roleType"
                  label="Role Type*"
                  options={userRoleTypes}
                />

                <RHFTextField name="description" label="Description" minRows={8} multiline />

                <Grid display="flex">
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
