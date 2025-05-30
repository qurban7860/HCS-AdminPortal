import { useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import FormProvider, { RHFTextField, RHFCheckbox, RHFPasswordField, RHFReCaptchaV2 } from '../../components/hook-form';

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
    recaptchaToken: Yup.string().label("reCAPTCHA").required('reCAPTCHA is Required!'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: false,
    recaptchaToken: ''
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

  const { remember, email, password, recaptchaToken } = watch()
  useEffect(() => {
    const storedEmail = localStorage.getItem("hcp-login");
    const storedPassword = localStorage.getItem("hcp-pass");
    const storedRemember = localStorage.getItem("remember");
    if (storedEmail && storedPassword && storedRemember) {
      const decodedPassword = atob(storedPassword);
      setValue('email', storedEmail);
      setValue('password', decodedPassword);
      setValue('remember', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const onSubmit = async (data) => {
    try {
      if (remember) {
        const encodedPassword = btoa(password);
        localStorage.setItem("hcp-login", email);
        localStorage.setItem("hcp-pass", encodedPassword);
        localStorage.setItem("remember", remember);
      } else {
        localStorage.removeItem("hcp-login");
        localStorage.removeItem("hcp-pass");
        localStorage.removeItem("remember");
      }

      await login(data);
      if (localStorage.getItem("MFA")) {
        navigate(PATH_AUTH.authenticate);
        localStorage.removeItem("MFA");
      }
      reset();
    } catch (error) {
      if (regEx.test(error.MessageCode)) {
        console.error("error : ", error?.Message || '');
        setError('afterSubmit', {
          ...error,
          message: error.Message,
        });
      } else {
        console.error("error : ", error || '');
        setError('afterSubmit', {
          ...error,
          message: error,
        });
      }
    }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {!!errors.afterSubmit && <Alert sx={{ width: '380px' }} severity="error">{errors.afterSubmit.message}</Alert>}
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

        <RHFCheckbox name="remember" label="Remember Me" variant="soft" />

        {email.trim() && password.trim().length >= 6 && (
          <RHFReCaptchaV2
            name='recaptchaToken'
          />
        )}


        <LoadingButton
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitSuccessful || isSubmitting}
          disabled={!recaptchaToken}
          sx={{ bgcolor: '#10079F', color: 'white', '&:hover': { bgcolor: '#FFA200' } }}
        >
          Login
        </LoadingButton>
      </Stack>
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
