import * as Yup from 'yup';
import { useState } from 'react';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack, Card,Container,IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../components/iconify';
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { Cover } from '../components/Cover'
import { SecurityUserPasswordUpdate } from '../../redux/slices/securityUser/securityUser';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function SecurityUserChangePassword() {
  const { userId, user } = useAuthContext();
  console.log("userId : " , userId)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters')
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

  const onSubmit = async (data) => {
    try {
      if(userId){
        await dispatch(SecurityUserPasswordUpdate(data,userId));
        reset();
        enqueueSnackbar('Update success!');
      }
      console.log('DATA', data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Container maxWidth={false}>
        <Card sx={{ mb: 3, height: 160, position: 'relative', }} >
          <Cover name="Change User Password" icon='mdi:user-circle'/>
        </Card>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          <RHFTextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
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
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="current-password"
        />
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Change Password
          </LoadingButton>
        </Stack>
      </Card>
    </Container>
    </FormProvider>
  );
}
