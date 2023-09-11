import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, IconButton, InputAdornment, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import FormProvider, { RHFTextField} from '../components/hook-form';
import Iconify from '../components/iconify';

import { PATH_AUTH, PATH_PAGE } from '../routes/paths';

import {
  updatePasswordUserInvite,
  verifyUserInvite,
} from '../redux/slices/securityUser/securityUser';

// ----------------------------------------------------------------------

export default function UserInviteLanding() {
  const { id, code, expiry } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const expired = new Date(parseInt(expiry,10))>new Date();
  const verifyInviteStatus = useSelector((state) => state.verifyInviteStatus);
  
  const ChangePassWordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .max(18, 'Password must be less than 18 characters')
      .required('Password is required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const defaultValues = {
    password: '',
    confirmPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  useEffect(() => {

    console.log(id, code, expired)
    
    if(expired){
      navigate(PATH_PAGE.expiredErrorPage);
    }else if (id && code) {
      const responsePromise = dispatch(verifyUserInvite(id,code));
      responsePromise.catch(error => {
        navigate(PATH_PAGE.invalidErrorPage);
      });
    }else{
      navigate(PATH_PAGE.invalidErrorPage);
    }
  }, [id, code, expired, navigate, dispatch]);

  console.log(id, code, expired)
  console.log(verifyInviteStatus)
  
  const {
    reset,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    if (id) {
      try {
        await dispatch(updatePasswordUserInvite(data, id));
        enqueueSnackbar('Password has been updated Successfully!');
        reset();
        navigate(PATH_AUTH.login);
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
    }else{
      navigate(PATH_PAGE.invalidErrorPage);
    }
  };

  return (
    
    
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{mb:3}}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <RHFTextField name="password" id="password" label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),maxLength: 10,
          }} required
        />

        <RHFTextField name="confirmPassword" id="confirmPassword"  label="Confirm Password" 
          type={showConfirmPassword ? 'text' : 'password'} 
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }} required
        />

        <LoadingButton
                fullWidth
                color="inherit"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitSuccessful || isSubmitting}
                sx={{ bgcolor: '#10079F', color: 'white', '&:hover': { bgcolor: '#FFA200' }}}
              >
                Save Password
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

}
