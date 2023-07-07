import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
import axios from '../../utils/axios';
import { CONFIG } from '../../config-global';
import { useSnackbar } from '../../components/snackbar';

// ----------------------------------------------------------------------

export default function AuthResetPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const regEx = /^[4][0-9][0-9]$/


  const navigate = useNavigate();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { login: '' },
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${CONFIG.SERVER_URL}security/forgetPassword`, data);
      enqueueSnackbar(response.data.Message);

      // await new Promise((resolve) => setTimeout(resolve, 500));
      // sessionStorage.setItem('email-recovery', data.email);
      // navigate(PATH_AUTH.newPassword);
    } catch (error) {
      console.error(error);
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

      {!!errors.afterSubmit && <Alert 
        severity="error" 
        sx={{ mb: 3 }}
        >
          {errors.afterSubmit.message}
      </Alert>}
      
      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ mt: 3 }}
      >
        Send Request
      </LoadingButton>
    </FormProvider>
  );
}
