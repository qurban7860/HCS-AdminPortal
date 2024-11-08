import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, memo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// form
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, Box, IconButton, InputAdornment, Stack, Typography, Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import { StyledRoot, StyledContent } from '../layouts/login/styles';
import FormProvider, { RHFPhoneInput, RHFTextField} from '../components/hook-form';
import Iconify from '../components/iconify';
import Logo from '../components/logo';
//
import { PATH_AUTH, PATH_PAGE } from '../routes/paths';
import {
  updateInvitedUser,
  verifyUserInvite,
} from '../redux/slices/securityUser/securityUser';
import { CONFIG } from '../config-global';


// ----------------------------------------------------------------------

function UserInviteLanding() {
  const { id, code, expiry } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const expired = new Date(expiry).getTime() > new Date().getTime();
  const { verifiedInvite } = useSelector((state) => state.user);
  
  const ChangePassWordSchema = Yup.object().shape({
    fullName:Yup.string().trim().max(50, 'Name must be less than 50 characters').required('Name is required'),
    phone: Yup.string().label('Phone Number'),
    password: Yup.string().trim()
      .min(6, 'Password must be at least 6 characters').max(18, 'Password must be less than 18 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Please confirm password'),
  });

  const defaultValues = useMemo(
    () => ({
      customerName: verifiedInvite?.customerName ||'',
      contactName:verifiedInvite?.contactName ||'',
      fullName:verifiedInvite?.fullName || '',
      login: verifiedInvite?.login || '',
      phone:verifiedInvite?.phone ||'',
      email:verifiedInvite?.email ||'',
      password:'',
      confirmPassword:'',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [verifiedInvite]
  );

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  useEffect(() => {
    if(expired){
      navigate(PATH_PAGE.expiredErrorPage);
    }else if (id && code) {
      const response = dispatch(verifyUserInvite(id,code));
      response.catch(error => {
        navigate(PATH_PAGE.invalidErrorPage);
      });

    }else{
      navigate(PATH_PAGE.invalidErrorPage);
    }
  }, [id, code, expired, navigate, dispatch]);

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors, isSubmitSuccessful},
  } = methods;

  useEffect(() => {
    setValue('customerName',verifiedInvite?.customerName || '')
    setValue('contactName',verifiedInvite?.contactName || '')
    setValue('fullName',verifiedInvite?.fullName || '')
    setValue('login',verifiedInvite?.login || '')
    setValue('email',verifiedInvite?.email || '')
  },[verifiedInvite, setValue])

  const onSubmit = async (data) => {
    if (id) {
      try {
        await dispatch(updateInvitedUser(data, id));
        enqueueSnackbar('Password has been updated Successfully!');
        reset();
        console.log("PORTAL_LOGIN_URL : ",CONFIG?.PORTAL_LOGIN_URL)
        if( verifiedInvite?.customerType?.toLowerCase() !== "sp" && CONFIG?.PORTAL_LOGIN_URL ){
          const url = CONFIG?.PORTAL_LOGIN_URL || ""
          window.open(url, '_blank');
        } else if(  verifiedInvite?.customerType?.toLowerCase() === "sp" ) {
          navigate(PATH_AUTH.login);
        }
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
    <StyledRoot sx={{width:900, margin:"0 auto"}}>
      <StyledContent>
        <Grid sx={{ display: 'flex', justifyContent: 'center'}} >
          <Grid item>
            <Logo sx={{ width: '100%', p: 1, pointerEvents: 'none', }}/>
            <Stack sx={{ alignItems: 'center' }} >
              <Typography variant="h2" sx={{ mt:-2, mb: 6 }}>User Invitation</Typography>
            </Stack>
          </Grid>
        </Grid>
        <Stack sx={{ width: '100%'}}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} >
        <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'}}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

            <RHFTextField name="customerName" label="Customer" disabled/>
            <RHFTextField name="contactName" label="Contact" disabled/>
            <RHFTextField name="fullName" label="Full Name*" />
            <RHFPhoneInput name="phone" label="Phone Number" />
          </Box>
            <RHFTextField name="login" label="Login" disabled />
            <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)'}}>
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
              }}
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
              }}
            />
          </Box>
          <Box sx={{mt:3, display:'flex', justifyContent:"end"}}>
            <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitSuccessful || isSubmitting}
                    sx={{ bgcolor: '#10079F', color: 'white', '&:hover': { bgcolor: '#FFA200' }}} >Save
            </LoadingButton>
          </Box>
          </Stack>
        </FormProvider>

        </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
export default memo(UserInviteLanding)