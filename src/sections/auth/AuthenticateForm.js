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
import { useSnackbar } from '../../components/snackbar';

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
  const { enqueueSnackbar } = useSnackbar();
  
  
  useEffect(() => {
    const storedEmail =       localStorage.getItem("UserEmail");
    const storedPassword =    localStorage.getItem("UserPassword");
    const storedRemember =    localStorage.getItem("remember");
    if (storedEmail && storedPassword && storedRemember) {
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
        localStorage.setItem("remember", uremember);
      } else {
        localStorage.removeItem("UserEmail");
        localStorage.removeItem("UserPassword");
        localStorage.removeItem("remember");
      }
    const response =   await login(data.email, data.password);
    } catch (error) {
        enqueueSnackbar('Unable to Login!', { variant: 'error' });
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
          
        <RHFTextField type="number" name="code" value={uemail}  onChange={(e) => setEmail(e.target.value)} label="Code" required/>

        <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting}
        sx={{ bgcolor: '#10079F', color: 'white', '&:hover': { bgcolor: '#FFA200' }}}
      >
        Submit
      </LoadingButton>

      </Stack>
      
      
    </FormProvider>
  );

}
