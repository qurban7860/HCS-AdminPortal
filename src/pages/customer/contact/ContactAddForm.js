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
import { Box, Card, Grid, Stack, Button, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getCustomers } from '../../../redux/slices/customer/customer';

import { saveContact, setFormVisibility } from '../../../redux/slices/customer/contact';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

import { useAuthContext } from '../../../auth/useAuthContext';

import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFUpload,
  RHFTextField,
  RHFSwitch
} from '../../../components/hook-form';

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

  const { formVisibility } = useSelector((state) => state.contact);

  const { customer } = useSelector((state) => state.customer);

  const { userId, user } = useAuthContext();

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddContactSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    title: Yup.string(),
    contactTypes: Yup.array(),
    phone: Yup.string(),
    email: Yup.string().trim('The email name cannot include leading and trailing spaces').email('Email must be a valid email address'),
  });

  const defaultValues = useMemo(
    () => ({
      customer: customer._id,
      firstName: '',
      lastName: '',
      title: '',
      contactTypes: [],
      phone: '',
      email: '',
      loginUser: {
        userId,
        email: user.email,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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

  useEffect(() => {
    reset(defaultValues);
    if (!formVisibility) {
      dispatch(setFormVisibility(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);


  const onSubmit = async (data) => {
    // console.log(data);
      try{
        await dispatch(saveContact(data));
        reset();
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };

  const toggleCancel = () => 
    {
      dispatch(setFormVisibility(false));
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
              
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Contact
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
