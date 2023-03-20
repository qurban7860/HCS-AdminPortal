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
  import { CONFIG } from '../../../config-global';
  // slice
  import { updateContact, setEditFormVisibility } from '../../../redux/slices/customer/contact';
  // routes
  import { PATH_DASHBOARD } from '../../../routes/paths';
  // components
  import { useSnackbar } from '../../../components/snackbar';
  import Iconify from '../../../components/iconify';

  import FormProvider, {
    RHFSelect,
    RHFMultiSelect,
    RHFUpload,
    RHFTextField,

  } from '../../../components/hook-form';



  // ----------------------------------------------------------------------

  const CONTACT_TYPES = [
    { value: 'technical', label: 'Technical' },
    { value: 'financial', label: 'Financial' },
    { value: 'support', label: 'Support' },
  ];

  ContactEditForm.propTypes = {
    isEdit: PropTypes.bool,
    readOnly: PropTypes.bool,
    currentAsset: PropTypes.object,
  };

  export default function ContactEditForm({ isEdit, readOnly, currentAsset }) {

    const { contact, isLoading, error } = useSelector((state) => state.contact);

    const { customer } = useSelector((state) => state.customer);

    const dispatch = useDispatch();

    const { enqueueSnackbar } = useSnackbar();

    const EditContactSchema = Yup.object().shape({
      // customer: Yup.string(),
      firstName: Yup.string(),
      lastName: Yup.string(),
      title: Yup.string(),
      contactTypes: Yup.array(),
      phone: Yup.string(),
      email: Yup.string().trim('The contact name cannot include leading and trailing spaces').email('Email must be a valid email address'),
      // isPrimary: Yup.boolean(),
    });


    const defaultValues = useMemo(
      () => ({
        id: contact?._id || '',
        customer: contact?.customer || '',
        firstName: contact?.firstName || '',
        lastName: contact?.lastName || '',
        title: contact?.title || '',
        contactTypes: contact?.contactTypes || [],
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
      // console.log(data);
      try {
        await dispatch(updateContact(contact.customer._id, data));
        reset();
        // navigate(PATH_DASHBOARD.contact.list);
      } catch (err) {
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
    };

    const toggleCancel = () => 
    {
      dispatch(setEditFormVisibility(false));
    };


    return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={6}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >

              <RHFTextField name="firstName" label="First Name" />

              <RHFTextField name="lastName" label="Last Name" />

              <RHFTextField name="title" label="Title" />

              <RHFMultiSelect
                chip
                checkbox
                name="contactTypes"
                label="Contact Types"
                options={CONTACT_TYPES}
              />

              <RHFTextField name="phone" label="Phone" />

              <RHFTextField name="email" label="Email" />
              
              </Box>

              <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              > 
              <LoadingButton 
              type="submit" 
              variant="contained" 
              size="large" 
              loading={isSubmitting}>
                   Save Changes
              </LoadingButton>
              
              <Button 
                onClick={toggleCancel}
                variant="outlined" 
                size="large">
                  Cancel
              </Button>

            </Box>

            </Stack>
            
          </Card>
      </Grid>
    </FormProvider>
    );
  }
