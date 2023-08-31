import * as Yup from 'yup';
import { useState } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Stack, Card, Container, IconButton, InputAdornment, Grid } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { Cover } from '../components/Defaults/Cover';
import { SecurityUserPasswordUpdate } from '../../redux/slices/securityUser/securityUser';
import AddFormButtons from '../components/DocumentForms/AddFormButtons';
import { PATH_SECURITY } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function SecurityUserChangePassword() {
  const navigate = useNavigate();
  // console.log("userId : " , userId)
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { securityUser } = useSelector((state) => state.user);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(18, 'Password must be less than 18 characters')
      .required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_SECURITY.users.view(securityUser._id));
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(SecurityUserPasswordUpdate(data, securityUser._id, true));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_SECURITY.users.view(securityUser._id));
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      console.log('Error:', error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth={false}>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
          <Cover name="Change User Password" icon="mdi:user-circle" />
        </Card>
        <Grid container spacing={2} sx={{ justifyContent: 'center', allignItem: 'center' }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} alignItems="flex-end" sx={{ pb: 3 }}>
                <RHFTextField
                  name="name"
                  label="Name"
                  type="name"
                  autoComplete="name"
                  value={securityUser.name}
                  disabled
                />

                <RHFTextField
                  name="email"
                  label="Login"
                  type="email"
                  autoComplete="email"
                  value={securityUser.login}
                  disabled
                />

                <RHFTextField
                  name="newPassword"
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                          <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="current-password"
                />
                <RHFTextField
                  name="confirmNewPassword"
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          <Iconify
                            icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="current-password"
                />
                {/* <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    Change Password
                  </LoadingButton> */}
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
