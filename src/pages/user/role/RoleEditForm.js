import * as Yup from 'yup';
import {  useMemo, useState, useLayoutEffect } from 'react';
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
  Typography,
  Autocomplete,
  Container,
} from '@mui/material';
// global
// slice
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFSwitch,
} from '../../../components/hook-form';
import { getRole, updateRole } from '../../../redux/slices/securityUser/role';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function RoleEditForm() {
  const { role, userRoleTypes } = useSelector((state) => state.role);
  const [roleType, setRoleType] = useState('');

  const roleTypesArray = useMemo(
    () =>
      Object.keys(userRoleTypes).map((key) => ({
        key,
        name: userRoleTypes[key],
      })),
    [userRoleTypes]
  );

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const EditRoleSchema = Yup.object().shape({
    name: Yup.string().min(2).max(50).required('Name Field is required!'),
    description: Yup.string().max(10000),
    /* eslint-disable */
    roleTypes: Yup.string().when('roleType', {
      is: (roleType) => roleType !== '',
      then: Yup.string().required('Role type is required!'),
      otherwise: Yup.string().notRequired(),
    }),
    /* eslint-enable */
    allModules: Yup.boolean(),
    allWriteAccess: Yup.boolean(),
    isActive: Yup.boolean(),
    disableDelete: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: role?.name || '',
      description: role?.description || '',
      isActive: role?.isActive || false,
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
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = methods;

  watch();

  useLayoutEffect(() => {
    const filteredRole = roleTypesArray.find((x) => x.key === role?.roleType);
    if (filteredRole) {
      setRoleType(filteredRole);
      setValue('roleTypes', filteredRole?.name);
    }
  }, [role, roleTypesArray, setValue]);

  const toggleCancel = () => {
    navigate(PATH_SETTING.role.view(role._id));
  };

  const handleRoleTypeChange = (event, newValue) => {
    setRoleType(newValue);
    setValue('roleTypes', newValue?.name || '');
    trigger('roleTypes');
  };

  const onSubmit = async (data) => {
    try {
      if (roleType) {
        data.roleType = roleType.key;
      }
      await dispatch(updateRole(role._id, data));
      dispatch(getRole(role._id));
      navigate(PATH_SETTING.role.view(role._id));
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
                <RHFTextField name="name" label="Name" />
                <Autocomplete
                  required
                  value={roleType || null}
                  options={roleTypesArray}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  onChange={handleRoleTypeChange}
                  id="controllable-states-demo"
                  renderOption={(props, option) => (
                    <li {...props} key={option.key}>
                      {option.name}
                    </li>
                  )}
                  renderInput={(params) => (
                    <RHFTextField {...params} name="roleTypes" label="Role Types" />
                  )}
                  ChipProps={{ size: 'small' }}
                >
                  {(option) => (
                    <div key={option.key}>
                      <span>{option.name}</span>
                    </div>
                  )}
                </Autocomplete>
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex">
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
                        Active
                      </Typography>
                    }
                  />
                  <RHFSwitch
                    name="disableDelete"
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
                        Disable Delete
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
    </Container>
  );
}
