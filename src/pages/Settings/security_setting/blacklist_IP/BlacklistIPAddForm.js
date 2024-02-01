import * as Yup from 'yup';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Card,
  Grid,
  Container,
  Box,
} from '@mui/material';
// ROUTES
import { PATH_PAGE, PATH_SECURITY } from '../../../../routes/paths';
// slice
import { addBlacklistIPs } from '../../../../redux/slices/securityConfig/blacklistIP';
// components
import { useSnackbar } from '../../../../components/snackbar';
// assets
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';

export default function BlacklistIPAddForm() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');
  useEffect(() => {
    if(!isSuperAdmin){
      navigate(PATH_PAGE.page403)
    }
  }, [navigate, isSuperAdmin]);

  const BlacklistIPSchema = Yup.object().shape({
    blackListIP: Yup.string().required('IP is required to blacklist!'),
  });

  const methods = useForm({
    resolver: yupResolver(BlacklistIPSchema),
    defaultValues:{
      blackListIP:""
    }
  });


  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try { 
      await dispatch(addBlacklistIPs(data));
      enqueueSnackbar('IP blacklisted successfully!');
      reset();
      navigate(PATH_SECURITY.config.blacklistIP.list);
    } catch (error) {
      enqueueSnackbar('IP adding failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SECURITY.config.blacklistIP.list);
  };

 
  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
          // mt: '24px',
        }}
      >
        <Cover name="Blacklist IP" />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={2} columnGap={2} display="grid" sx={{mb:3}} gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                <RHFTextField name="blackListIP" label="BlackList IPs"
                  inputProps={{
                    pattern:"^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/(3[0-2]|[12]?[0-9])$|^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                  }} />
                </Box>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
