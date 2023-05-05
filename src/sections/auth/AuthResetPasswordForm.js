import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
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

  const navigate = useNavigate();

  const ResetPasswordSchema = Yup.object().shape({
    login: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { login: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
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
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <RHFTextField name="login" label="Email address" />

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
