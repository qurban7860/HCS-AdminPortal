import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Dialog, DialogContent, DialogTitle, Divider, InputAdornment, IconButton, DialogActions, Button, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { SecurityUserPasswordUpdate, resetLoadingResetPasswordEmail, sendResetPasswordEmail, setChangePasswordByAdminDialog } from '../../redux/slices/securityUser/securityUser';
import DialogLink from './DialogLink';
import FormLabel from '../DocumentForms/FormLabel';
import ViewPhoneComponent from '../ViewForms/ViewPhoneComponent';
import ViewFormField from '../ViewForms/ViewFormField';
import { useAuthContext } from '../../auth/useAuthContext';
import FormProvider from '../hook-form/FormProvider';
import { RHFTextField } from '../hook-form';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
import AddFormButtons from '../DocumentForms/AddFormButtons';

function ChangePasswordByAdminDialog() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePasswordByAdminDialog, securityUser, isLoadingResetPasswordEmail } = useSelector((state) => state.user);

  const handleChangePasswordByAdminDialog = () => { dispatch(setChangePasswordByAdminDialog(false))  }

  const { isAllAccessAllowed } = useAuthContext();
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

  const senResetPasswordLink = async () => {
    try{
      await dispatch(sendResetPasswordEmail(securityUser?.login));
      await dispatch(resetLoadingResetPasswordEmail());
      await dispatch(setChangePasswordByAdminDialog(false));
      await enqueueSnackbar('Email Sent Successfully!');
    }catch(e){
      dispatch(resetLoadingResetPasswordEmail())
      enqueueSnackbar(e, { variant: `error` } );
    }
  }

  const onSubmit = async (data) => {
    try {
      await dispatch(SecurityUserPasswordUpdate(data, securityUser._id, true));
      reset();
      dispatch(setChangePasswordByAdminDialog(false));
      enqueueSnackbar('Password has been updated Successfully!');
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
    <Dialog
      disableEnforceFocus
      fullWidth
      maxWidth="sm"
      open={changePasswordByAdminDialog}
      onClose={handleChangePasswordByAdminDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Change Password</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
      <DialogContent dividers sx={{py:2}}>
          <Box rowGap={2} display="grid">
              <RHFTextField name="name" label="Name" value={securityUser?.name || '' } disabled />
              <RHFTextField name="login" label="Login" value={securityUser?.login || '' } disabled />
              <RHFTextField name="email" label="Email" value={securityUser?.email || ''} disabled />

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
                label="Confirm Password"
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
          </Box>
        </DialogContent>
        <DialogActions>
            <Button variant='outlined' onClick={handleChangePasswordByAdminDialog}>Close</Button>
            { isAllAccessAllowed &&
              <LoadingButton variant="contained" startIcon={<Iconify icon="mdi:password-reset"/>}
              disabled={isLoadingResetPasswordEmail} loading={isLoadingResetPasswordEmail} onClick={senResetPasswordLink}>
                Send Reset E-mail
              </LoadingButton>
            }
            <LoadingButton type="submit" variant="contained" disabled={isLoadingResetPasswordEmail} loading={isSubmitting}>Change Password</LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}

export default ChangePasswordByAdminDialog;
