  import PropTypes from 'prop-types';
  import * as Yup from 'yup';
  import { useCallback, useEffect, useMemo } from 'react';
  import { useDispatch, useSelector } from 'react-redux';

  import { useNavigate } from 'react-router-dom';
  // form
  import { useForm } from 'react-hook-form';
  import { yupResolver } from '@hookform/resolvers/yup';

  // @mui
  import { LoadingButton } from '@mui/lab';
  import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
  // global
  import { CONFIG } from '../../config-global';
  // slice
  import { updateContact } from '../../redux/slices/contact';
  // routes
  import { PATH_DASHBOARD } from '../../routes/paths';
  // components
  import { useSnackbar } from '../../components/snackbar';
  import Iconify from '../../components/iconify';

  import FormProvider, {
    RHFSelect,
    RHFMultiSelect,
    RHFUpload,
    RHFTextField,

  } from '../../components/hook-form';



  // ----------------------------------------------------------------------

  const CONTACT_TYPES = [
    { value: 'technical', label: 'Technical' },
    { value: 'financial', label: 'Financial' },
    { value: 'support', label: 'Support' },
  ];

  export default function ContactEditForm() {

    const { contact, error } = useSelector((state) => state.contact);

    const { customers } = useSelector((state) => state.customer);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const EditContactSchema = Yup.object().shape({
      customer: Yup.string(),
      firstName: Yup.string(),
      lastName: Yup.string(),
      title: Yup.string(),
      contactTypes: Yup.array(),
      phone: Yup.string(),
      email: Yup.string().email('Email must be a valid email address'),
      isPrimary: Yup.boolean(),
    });


    const defaultValues = useMemo(
      () => ({
        id: contact?._id || '',
        customer: contact?.customerId || '',
        firstName: contact?.firstName || '',
        lastName: contact?.lastName || '',
        title: contact?.title || '',
        contactTypes: contact?.contactTypes[0].split(',') || [],
        phone: contact?.phone || '',
        email: contact?.email || '',
      }),
      [contact]
    );

    const methods = useForm({
      resolver: yupResolver(EditContactSchema),
      defaultValues,
    });

    const {
      reset,
      watch,
      setValue,
      handleSubmit,
      formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
      if (contact) {
        reset(defaultValues);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contact]);


    const onSubmit = async (data) => {
      console.log(data);
      try {
        dispatch(updateContact(data));
        reset();
        enqueueSnackbar('Update success!');
        navigate(PATH_DASHBOARD.contact.list);
      } catch (err) {
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
    };


    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={7} md={7}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>

              <RHFSelect native name="customer" label="Customer">
                    <option value="" selected/>
                    { 
                    customers.length > 0 && customers.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>

              <RHFTextField name="firstName" label="First Name" />

              <RHFTextField name="lastName" label="Last Name" />

                <RHFMultiSelect
                  chip
                  checkbox
                  name="contactTypes"
                  label="Contact Types"
                  options={CONTACT_TYPES}
                />

              <RHFTextField name="title" label="Title" />

              <RHFTextField name="phone" label="Phone" />

              <RHFTextField name="email" label="Email" />



                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Changes
                </LoadingButton>
              </Stack>

            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    );
  }
