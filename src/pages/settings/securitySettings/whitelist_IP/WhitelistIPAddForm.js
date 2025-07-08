import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Container, Box, Typography } from '@mui/material';
// ROUTES
import { PATH_SETTING } from '../../../../routes/paths';
// slice
import { addWhitelistIPs } from '../../../../redux/slices/securityConfig/whitelistIP';
// components
import { useSnackbar } from '../../../../components/snackbar';
// assets
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import Iconify from '../../../../components/iconify';


export default function WhitelistIPAddForm() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const WhitelistIPSchema = Yup.object().shape({
    whiteListIP: Yup.string().required('IP is required to whitelist!'),
  });

  const methods = useForm({
    resolver: yupResolver(WhitelistIPSchema),
    defaultValues:{
      whiteListIP:""
    }
  });


  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try { 
      await dispatch(addWhitelistIPs(data));
      enqueueSnackbar('IP whitelisted successfully!');
      reset();
      navigate(PATH_SETTING.restrictions.whitelistIP.list);
    } catch (error) {
      enqueueSnackbar('IP adding failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.restrictions.whitelistIP.list);
  };

 
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Whitelist IP" />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={2} columnGap={2} display="grid" sx={{mb:3}} gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                <RHFTextField name="whiteListIP" label="WhiteList IPs"
                  inputProps={{
                    pattern:"^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/(3[0-2]|[12]?[0-9])$|^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$"
                  }} />
              </Box>
              <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <Iconify icon="eva:info-outline" sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  All IPs in whitelists are allowed third party API access from Customer Portal
                </Typography>
              </Box>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
