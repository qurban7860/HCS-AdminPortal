import * as Yup from 'yup';
import { useState } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
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
import { PATH_DASHBOARD, PATH_SECURITY } from '../../routes/paths';

// ----------------------------------------------------------------------

export default function SecurityUserChangePassword() {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  // console.log("userId : " , userId)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(18, 'Password must be less than 18 characters')
      .required('New Password is required'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    oldPassword: '',
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
    navigate(PATH_DASHBOARD.general.app);
  };
  const onSubmit = async (data) => {
    if (userId) {
      try {
        await dispatch(SecurityUserPasswordUpdate(data, userId));
        enqueueSnackbar('Password has been updated Successfully!');
        reset();
        navigate(PATH_SECURITY.users.view(userId));
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
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Container maxWidth={false}>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
          <Cover name="Change Password" icon="mdi:user-circle" />
        </Card>
        <Grid container spacing={2} sx={{ justifyContent: 'center', allignItem: 'center' }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3} alignItems="flex-end" sx={{ pb: 3 }}>
                <RHFTextField
                  name="oldPassword"
                  label="Old Password"
                  type={showOldPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end">
                          <Iconify icon={showOldPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="current-password"
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
              <AddFormButtons
                isSubmitting={isSubmitting}
                saveButtonName="Change"
                toggleCancel={toggleCancel}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </FormProvider>
  );
}
