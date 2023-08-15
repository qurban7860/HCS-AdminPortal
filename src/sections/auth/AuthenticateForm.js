import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Link, Stack, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH } from '../../routes/paths';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
import { useSnackbar } from '../../components/snackbar';
import { TITLES } from '../../constants/default-constants';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField} from '../../components/hook-form';


// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { muliFactorAuthentication } = useAuthContext();
  const regEx = /^[4][0-9][0-9]$/
  const [code, setCode] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const userId = localStorage.getItem('userId');


  const methods = useForm();

  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    if (code) {
      // data.multiFactorAuthenticationCode = code;
    }
    try {
      await muliFactorAuthentication(code, userId);
    } catch (error) {
      enqueueSnackbar('Unable to Login!', { variant: 'error' });
      console.error("error: ", error);
      if (regEx.test(error.MessageCode)) {
        setError('afterSubmit', {
          ...error,
          message: error.Message,
        });
      } else {
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
          
        <RHFTextField
          type="number"
          name="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          label="Code"
          required
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
          Submit
        </LoadingButton>
      </Stack>
      <Stack alignItems="flex-end" sx={{ my: 2 }}>
      <Link
        component={RouterLink}
        to={PATH_AUTH.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          mt: 3,
          mx: 'auto',
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:chevron-left-fill" width={16} />
        {TITLES.FORGOT_RETURN}
      </Link>
      </Stack>
    </FormProvider>
  );
}

