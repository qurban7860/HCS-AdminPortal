import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import { Box,Card, Grid, Stack, Typography, CardHeader } from '@mui/material';
// slice
import {moveCustomerContact, setContactMoveFormVisibility } from '../../../redux/slices/customer/contact';
import { getActiveCustomers } from '../../../redux/slices/customer/customer';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { getActiveSites, resetActiveSites } from '../../../redux/slices/customer/site';
// ----------------------------------------------------------------------

export default function ContactMoveForm() {
  const { activeSites } = useSelector((state) => state.site);
  const { contact } = useSelector((state) => state.contact);
  const { activeCustomers } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const MoveMachineSchema = Yup.object().shape({
    customer: Yup.object().shape({name: Yup.string()}).nullable().required('Customer is required!'),
  });

  const defaultValues = useMemo(
    () => ({
      customer: null,
      contact: '',
      sites: '',

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(MoveMachineSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    dispatch(resetActiveSites())
    dispatch(getActiveCustomers())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const { customer } = watch();
  useEffect(() => {
    if(customer !== null){
      dispatch(getActiveSites(customer?._id))
    }else{
      dispatch(resetActiveSites())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const onSubmit = async (data) => {
    
    if(customer){
      data.customer = customer?._id;
    }

    if(contact){
      data.contact = contact;
    }

    console.log(data)

    try {
      await dispatch(moveCustomerContact(data));
      enqueueSnackbar('Contact moved successfully!');
      reset();
      setContactMoveFormVisibility(false);
    } catch (error) {
      enqueueSnackbar('Moving failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    dispatch(setContactMoveFormVisibility(false));
  };

  return (
    <>
      <Card sx={{ width: '100%', p: '0', mb:3 }}>
        <CardHeader title="Customer Detail" sx={{p:'5px 15px', m:0, color:'white', 
        backgroundImage: (theme) => `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`}} />
        <Grid container>
          <ViewFormField sm={6} heading="Name" param={`${contact?.firstName} ${contact?.lastName}`} />
          <ViewFormField sm={6} heading="Title" param={contact?.title} />
          {/* <ViewFormField sm={6} heading="Email" param={contact?.email} />
          <ViewFormField sm={6} heading="Phone" param={contact?.phone} /> */}
        </Grid>
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h3" sx={{ color: 'text.secondary' }}>Move Contact</Typography>
                </Stack>
                <RHFAutocomplete 
                    name="customer"
                    label="Customer*"
                    options={activeCustomers}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
                  <RHFAutocomplete 
                    // multiple
                    name="sites"
                    label="Site"
                    options={activeSites}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                    )}
                  />
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
