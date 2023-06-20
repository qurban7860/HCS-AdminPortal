import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment, Checkbox, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField, RHFCheckbox} from '../../components/hook-form';
import theme from '../../theme';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { login } = useAuthContext();
  const regEx = /^[4][0-9][0-9]$/
  const [showPassword, setShowPassword] = useState(false);
  const [uemail, setEmail] = useState("");
  const [upassword, setPassword] = useState("");
  const [uremember, setRemember] = useState(false);
  
  useEffect(() => {
    const storedEmail =       localStorage.getItem("email");
    const storedPassword =    localStorage.getItem("password");
    const storedRemember =    localStorage.getItem("remember");
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRemember(true);
    }
  }, []);

  const LoginSchema = Yup.object().shape({
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    // password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: uemail,
    password: upassword,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    if(uemail){
      data.email = uemail;
    }
    if(upassword){
      data.password = upassword;
    }
    try {
      if (uremember) {
        localStorage.setItem("UserEmail", data.email);
        localStorage.setItem("UserPassword", data.password);
        localStorage.setItem("remember", data.remember);
      } else {
        localStorage.removeItem("UserEmail");
        localStorage.removeItem("UserPassword");
        localStorage.removeItem("remember");
      }
    const response =   await login(data.email, data.password);
    } catch (error) {
      console.error("error : ",error);
      if(regEx.test(error.MessageCode)){
        reset();
        setError('afterSubmit', {
          ...error,
          message: error.Message,
        });
    }else{
      setError('afterSubmit', {
        ...error,
        message: "Something went wrong",
      });
    }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ mt: 1 }}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
          
        <RHFTextField type="email" name="email" value={uemail}  onChange={(e) => setEmail(e.target.value)} label="Login/Email address"  autoComplete="username" required/>

        <RHFTextField
          name="password"
          id="password"
          value={upassword}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="current-password"
          required
        />
      </Stack>

      <FormControlLabel
        control={
            <Checkbox
                name="remember"
                checked={uremember}
                onChange={() => setRemember(!uremember)}
                variant="soft"
            />
        }
        label="Remember Me" 
        />

      {/* <RHFCheckbox name="remember"  label="Remember Me" variant="soft" value={uremember} Checked/> */}
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
