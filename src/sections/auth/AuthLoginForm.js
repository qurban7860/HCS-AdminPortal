import { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField, RHFCheckbox, RHFPasswordField } from '../../components/hook-form';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {

  const navigate = useNavigate();
  const { login } = useAuthContext();
  const inputRef = useRef(null);
  const regEx = /^[4][0-9][0-9]$/

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
    .transform((value, originalValue) => originalValue ? originalValue.toLowerCase() : value)
    .email()
    .label('Login/Email Address')
    .trim()
    .required('Login/Email address is Required!')
    .max(200),
    password: Yup.string().label("Password").required('Password is Required!'),
  });

  const defaultValues = {
    email: '',
    password: '',
    isRemember: false,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const { isRemember, email, password } = watch()

  useEffect(() => {
    const storedEmail =       localStorage.getItem("HowickUserEmail");
    const storedPassword =    localStorage.getItem("HowickUserPassword");
    const storedRemember =    localStorage.getItem("isRemember");
    if (storedEmail && storedPassword && storedRemember) {
      setValue('email',storedEmail);
      setValue('password',storedPassword);
      setValue('isRemember',true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
  const onSubmit = async (data) => {
    try {
      if (isRemember) {
        localStorage.setItem("HowickUserEmail", email);
        localStorage.setItem("HowickUserPassword", password);
        localStorage.setItem("isRemember", isRemember);
      } else {
        localStorage.removeItem("HowickUserEmail");
        localStorage.removeItem("HowickUserPassword");
        localStorage.removeItem("isRemember");
      }
      await login(data.email, data.password);
      if(localStorage.getItem("MFA")) {
        navigate(PATH_AUTH.authenticate);
        localStorage.removeItem("MFA");
      }
      reset();
    } catch (error) {
      if(regEx.test(error.MessageCode)){
        console.error("error : ",error?.Message || '');
        setError('afterSubmit', {
          ...error,
          message: error.Message,
        });
      }else{
        console.error("error : ",error || '');
        setError('afterSubmit', {
          ...error,
          message: error,
        });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ mt: 1 }}>
        {!!errors.afterSubmit && <Alert sx={{width:'380px'}} severity="error">{errors.afterSubmit.message}</Alert>}
        <RHFTextField 
          type="email" 
          name="email"
          label="Login/Email address*" 
          autoComplete="username" 
          inputRef={inputRef}
          inputProps={{ style: { textTransform: 'lowercase' } }}
        />
        <RHFPasswordField
          name="password"
          id="password"
          label="Password*"
          autoComplete="current-password"
        />
      </Stack>

      <RHFCheckbox name="isRemember" label="Remember Me"  variant="soft"/>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{ bgcolor: '#10079F', color: 'white', '&:hover': { bgcolor: '#FFA200' }}}
      >
        Login
      </LoadingButton>
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
        <Link
          component={RouterLink}
          to={PATH_AUTH.resetPassword}
          variant="body2"
          color="inherit"
          underline="always"
        >
          Forgot password?
        </Link>
      </Stack>
    </FormProvider>
  );

}
