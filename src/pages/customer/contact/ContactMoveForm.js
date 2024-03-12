import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack } from '@mui/material';
// slice
import { setIsExpanded, moveCustomerContact,getContacts, getContact } from '../../../redux/slices/customer/contact';
import customer, { getActiveCustomers } from '../../../redux/slices/customer/customer';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete } from '../../../components/hook-form';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { PATH_CUSTOMER } from '../../../routes/paths';

// ----------------------------------------------------------------------

export default function ContactMoveForm( ) {
  const { contact } = useSelector((state) => state.contact);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const { customerId, id } = useParams() 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const MoveMachineSchema = Yup.object().shape({
    customer: Yup.object().shape({name: Yup.string()}).nullable().required('Customer is required!'),
  });

  const defaultValues = useMemo(
    () => ({
      customer: null,
      contact: null,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(MoveMachineSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    dispatch(getActiveCustomers())
  }, [ dispatch ]);

  useEffect(() => {
    dispatch(getContact(customerId, id))
  }, [ dispatch, customerId, id ]);
  
  const onSubmit = async (data) => {
    try {
      await dispatch(moveCustomerContact(data));
      enqueueSnackbar('Contact moved successfully!');
      await dispatch(setIsExpanded(false));
      await dispatch(getContacts(customerId));
      await navigate(PATH_CUSTOMER.contact.root(customerId))
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => navigate(PATH_CUSTOMER.contact.root(customerId));

  return (
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <FormLabel content="Contact Detail" />
                <Grid container sx={{pb:2}}>
                  <ViewFormField sm={6} heading="Name" param={`${contact?.firstName} ${contact?.lastName}`} />
                  <ViewFormField sm={6} heading="Title" param={contact?.title} />
                  <ViewFormField sm={6} heading="Email" param={contact?.email} />
                  <ViewFormField sm={6} heading="Phone" param={contact?.phone} />
                </Grid>
                <Stack spacing={2}>
                  <FormLabel content="Move Contact" />
                  <RHFAutocomplete 
                      name="customer"
                      label="Customer*"
                      options={activeCustomers.filter(activeCustomer => activeCustomer._id !== id)}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                    />
                  <AddFormButtons isSubmitting={isSubmitting} saveButtonName='Move' toggleCancel={toggleCancel} />
                </Stack>
            </Card>
        </Grid>
      </FormProvider>
  );
}
