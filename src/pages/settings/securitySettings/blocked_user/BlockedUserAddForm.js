import * as Yup from 'yup';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { PATH_SECURITY } from '../../../../routes/paths';
// slice
import { getActiveSecurityUsers, resetSecurityUsers } from '../../../../redux/slices/securityUser/securityUser';
import { addBlockedUsers, getBlockedUsers, resetBlockedUsers } from '../../../../redux/slices/securityConfig/blockedUsers';
// components
import { useSnackbar } from '../../../../components/snackbar';
// assets
import FormProvider, { RHFAutocomplete } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';


export default function BlockedUserAddForm() {

  const { activeSecurityUsers } = useSelector((state) => state.user);
  const { blockedUsers } = useSelector((state) => state.blockedUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getActiveSecurityUsers());
    dispatch(getBlockedUsers());
    return () => {
      dispatch(resetSecurityUsers());
      dispatch(resetBlockedUsers());
    }
  },[dispatch])

  const usersNotBlocked = activeSecurityUsers.filter((securityUser) => (
    !blockedUsers.some((blockedUser) => blockedUser?.blockedUser?._id === securityUser._id)
  ));

  const BlockCustomerSchema = Yup.object().shape({
    user: Yup.object().shape({name: Yup.string()}).nullable().required('User is required!'),
  });

  const methods = useForm({
    resolver: yupResolver(BlockCustomerSchema),
    defaultValues:{
      user:null,
      blockedUser:null
    }
  });


  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { user } = watch();
  
  const onSubmit = async (data) => {
    try { 
      // data.blockedUsers = data?.blockedUsers?.map((customer1) => customer1?._id);
      data.blockedUser = user?._id;
      await dispatch(addBlockedUsers(data));
      enqueueSnackbar('User blocked successfully!');
      reset();
      navigate(PATH_SECURITY.config.blockedUser.list);
    } catch (error) {
      enqueueSnackbar('User blocking failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SECURITY.config.blockedUser.list);
  };

 
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Block User" />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={2} columnGap={2} display="grid" sx={{mb:3}} gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                  <RHFAutocomplete
                    // multiple 
                    name="user"
                    label="User*"
                    options={usersNotBlocked}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
              </Box>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
