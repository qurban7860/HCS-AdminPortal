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
  Typography,
  Autocomplete,
  Container,
} from '@mui/material';
// ROUTES
import { PATH_SETTING } from '../../../routes/paths';
// slice
import { addRole } from '../../../redux/slices/securityUser/role';

// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';

// ----------------------------------------------------------------------
RoleAddForm.propTypes = {
  currentRole: PropTypes.object,
};

export default function RoleAddForm({ currentRole }) {
  const { userRoleTypes } = useSelector((state) => state.role);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [roleType, setRoleType] = useState('');
  const mappedUserRoleTypes = Object.keys(userRoleTypes).map((key) => ({
    key,
    name: userRoleTypes[key],
  }));

  // a note can be archived.
  const AddRoleSchema = Yup.object().shape({
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
      name: '',
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
    // watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      await dispatch(addRole(data));
      reset();
      enqueueSnackbar('Role Save Successfully!');
      navigate(PATH_SETTING.role.list);
    } catch (error) {
      enqueueSnackbar('Role Save failed!', { variant: `error` });
      console.error(error);
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
                <Autocomplete
                  // freeSolo
                  required
                  value={roleType || null}
                  options={mappedUserRoleTypes}
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
