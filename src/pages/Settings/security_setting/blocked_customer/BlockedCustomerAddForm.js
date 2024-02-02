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
import { PATH_PAGE, PATH_SECURITY } from '../../../../routes/paths';
// slice
import { getActiveCustomers, resetCustomers } from '../../../../redux/slices/customer/customer';
import { addBlockedCustomers, getBlockedCustomers, resetBlockedCustomers } from '../../../../redux/slices/securityConfig/blockedCustomers';
// components
import { useSnackbar } from '../../../../components/snackbar';
// assets
import FormProvider, { RHFAutocomplete } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';


export default function BlockedCustomerAddForm() {

  const { activeCustomers } = useSelector((state) => state.customer);
  const { blockedCustomers } = useSelector((state) => state.blockedCustomer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(resetCustomers());
    dispatch(getActiveCustomers());
    dispatch(resetBlockedCustomers());
    dispatch(getBlockedCustomers());
  },[dispatch])

  const customersNotBlocked = activeCustomers.filter((customer) => (
    !blockedCustomers.some((blockedCustomer) => blockedCustomer?.blockedCustomer?._id === customer._id)
  ));
 

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
                    options={customersNotBlocked}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
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
