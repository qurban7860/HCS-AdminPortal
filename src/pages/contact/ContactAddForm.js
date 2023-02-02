import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getCustomers } from '../../redux/slices/customer';

import { saveContact } from '../../redux/slices/contact';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';

import { useAuthContext } from '../../auth/useAuthContext';

import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFUpload,
  RHFTextField,
  RHFSwitch
} from '../../components/hook-form';

// ----------------------------------------------------------------------

ContactAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentContact: PropTypes.object,
};

const CONTACT_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'financial', label: 'Financial' },
  { value: 'support', label: 'Support' },
];

export default function ContactAddForm({ isEdit, readOnly, currentContact }) {

  const { isLoading } = useSelector((state) => state.contact);

  const { customers } = useSelector((state) => state.customer);
  
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddContactSchema = Yup.object().shape({
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
      customer: '',
      firstName: '',
      lastName: '',
      title: '',
      contactTypes: [],
      phone: '',
      email: '',
      isPrimary: true
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentContact]
  );

  const methods = useForm({
    resolver: yupResolver(AddContactSchema),
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

  useLayoutEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  const onSubmit = async (data) => {
    console.log(data);
      try{
        await dispatch(saveContact(data));
        reset();
        navigate(PATH_DASHBOARD.contact.list);
      } catch(error){
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
                Save Contact
            </LoadingButton>
            </Stack>
            
          </Card>
          
        </Grid>
      </Grid>
    </FormProvider>
  );
}
