import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Box, Card, Grid, Stack } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from '../../../components/snackbar';
// slice
import { updateCustomerRegistration, getCustomerRegistration } from '../../../redux/slices/customer/customerRegistration';
// routes
import { PATH_CUSTOMER_REGISTRATION } from '../../../routes/paths';
// components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFChipsInput } from '../../../components/hook-form';
// schema
import { editCustomerRegistrationSchema } from '../../schemas/customer';
import FormLabel from '../../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function CustomerEditForm() {

  const { customerRegistration } = useSelector( (state) => state.customerRegistration );
  const { customerId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(getCustomerRegistration( customerId ));
  }, [ dispatch, customerId ]);

  const defaultValues = useMemo(
    () => ({

      customerName: customerRegistration?.customerName || "",
      contactPersonName: customerRegistration?.contactPersonName || "",
      email: customerRegistration?.email || "",
      phoneNumber: customerRegistration?.phoneNumber || "",
      status: customerRegistration?.status || "",
      customerNote: customerRegistration?.customerNote || "",
      internalRemarks: customerRegistration?.internalRemarks || "",
      acceptanceStatus: customerRegistration?.acceptanceStatus || "",
      machineSerialNos: customerRegistration?.machineSerialNos || "",
      address: customerRegistration?.address || "",
      isActive: customerRegistration?.isActive || false,
    
    }),
    [ customerRegistration ]
  );
  const methods = useForm({
    resolver: yupResolver( editCustomerRegistrationSchema ),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => navigate(PATH_CUSTOMER_REGISTRATION.view(customerId));

  const onSubmit = async (data) => {
    try {
      await dispatch(updateCustomerRegistration(data));
      reset();
      enqueueSnackbar('Customer updated successfully!');
      navigate(PATH_CUSTOMER_REGISTRATION.view(customerId));
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Stack spacing={2}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormLabel content="Edit Customer Register Request" />
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >

                  <RHFTextField name="customerName" label="Customer Name*" />
                  <RHFTextField name="contactPersonName" label="Contact Person Name" />
                  <RHFTextField name="email" label="Email*" />
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="address" label="Address" />
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name="phoneNumber" label="Phone Number" />

                  <RHFAutocomplete
                    name="status"
                    label="Status*"
                    options={ [ "NEW", "APPROVED", "REJECTED", "PENDING" ] }
                    disableCloseOnSelect
                    filterSelectedOptions
                  />
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="customerNote" label="Customer Note" />
                  <RHFTextField name="machineSerialNos" label="Machine Serial Nos" />

                </Box>

                <RHFSwitch name="isActive" label="Active" checked={defaultValues?.isActive} />

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />

              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
