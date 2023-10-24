import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MuiChipsInput } from 'mui-chips-input';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Card,
  Grid,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Container,
  Box,
} from '@mui/material';
// ROUTES
import { PATH_SECURITY, PATH_SETTING } from '../../../../routes/paths';
// slice
import { getCustomers, resetCustomers } from '../../../../redux/slices/customer/customer';
import { getSecurityUsers, resetSecurityUsers } from '../../../../redux/slices/securityUser/securityUser';
import { addBlockedCustomers } from '../../../../redux/slices/securityConfig/blockedCustomers';
// components
import { useSnackbar } from '../../../../components/snackbar';
// assets
import FormProvider, { RHFAutocomplete, RHFSwitch } from '../../../../components/hook-form';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../components/Defaults/Cover';


export default function BlockedCustomerAddForm() {

  const { customers } = useSelector((state) => state.customer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  

  useEffect(() => {
    dispatch(resetCustomers());
    dispatch(getCustomers());
  },[dispatch])

 

  const BlockCustomerSchema = Yup.object().shape({
    customer: Yup.object().shape({name: Yup.string()}).nullable().required('Customer is required!'),
  });

  const methods = useForm({
    resolver: yupResolver(BlockCustomerSchema),
    defaultValues:{
      customer:null,
      blockedCustomer:null
    }
  });


  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { customer } = watch();
  
  const onSubmit = async (data) => {
    try { 
      // data.blockedCustomers = data?.blockedCustomers?.map((customer1) => customer1?._id);
      data.blockedCustomer = customer?._id;
      await dispatch(addBlockedCustomers(data));
      enqueueSnackbar('Customers blocked successfully!');
      reset();
      navigate(PATH_SECURITY.config.blockedCustomer.list);
    } catch (error) {
      enqueueSnackbar('Customers blocking failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SECURITY.config.blockedCustomer.list);
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
        <Cover name="Block Customers" />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={2} columnGap={2} display="grid" sx={{mb:3}} gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)',}}>
                  <RHFAutocomplete
                    // multiple 
                    name="customer"
                    label="Customer*"
                    options={customers}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
              </Box>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
