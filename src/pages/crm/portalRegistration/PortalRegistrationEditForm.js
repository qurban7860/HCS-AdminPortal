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
import { updatePortalRegistration, getPortalRegistration } from '../../../redux/slices/customer/portalRegistration';
import { getValidateUserEmail } from '../../../redux/slices/securityUser/securityUser';

// routes
import { PATH_PORTAL_REGISTRATION } from '../../../routes/paths';
// components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFChipsInput, RHFCountryAutocomplete } from '../../../components/hook-form';
// schema
import { editPortalRegistrationSchema } from '../../schemas/customer';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { countries } from '../../../assets/data';

// ----------------------------------------------------------------------

export default function CustomerEditForm() {
  
  const { portalRegistration } = useSelector( (state) => state.portalRegistration );
  const { customerId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if(portalRegistration?.status?.toLowerCase() === 'approved'){
      navigate(PATH_PORTAL_REGISTRATION.permissionDenied)
    }
  }, [ portalRegistration, navigate, customerId ]);

  const defaultValues = useMemo(
    () => ({
      customerName: portalRegistration?.customerName || "",
      contactPersonName: portalRegistration?.contactPersonName || "",
      email: portalRegistration?.email || "",
      phoneNumber: portalRegistration?.phoneNumber || "",
      status: portalRegistration?.status || "",
      customerNote: portalRegistration?.customerNote || "",
      internalNote: portalRegistration?.internalNote || "",
      acceptanceStatus: portalRegistration?.acceptanceStatus || "",
      machineSerialNos: Array.isArray(portalRegistration?.machineSerialNos) ? portalRegistration?.machineSerialNos : [],
      country: countries.find(( c ) => c?.label?.toLocaleLowerCase() === portalRegistration?.country?.toLocaleLowerCase()) || null,
      address: portalRegistration?.address || "",
      isActive: portalRegistration?.isActive || false,
    }),
    [ portalRegistration ]
  );
  
  const methods = useForm({
    resolver: yupResolver( editPortalRegistrationSchema ),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    watch,
    trigger,
    clearErrors,
    formState: { isSubmitting, errors },
  } = methods;
  
  const  { email } = watch();

  useEffect(() => {
    trigger('email');
    const timeoutId = setTimeout(async () => {
      if (email && !errors.email && portalRegistration?.status?.toLowerCase() !== 'approved') { 
        try {
          await dispatch(getValidateUserEmail(email)); 
          clearErrors('email'); 
        } catch (err) {
          setError('email', { message: 'Email already exists' });
        }
      }
    }, 500);

    return () => clearTimeout(timeoutId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ email, dispatch ]);

  const toggleCancel = () => navigate(PATH_PORTAL_REGISTRATION.view(customerId));

  const onSubmit = async ( data ) => {
      try {
        if(portalRegistration?.status?.toLowerCase() === 'approved'){
          delete data?.email;
        }
        await dispatch(updatePortalRegistration( customerId, data ));
        reset();
        enqueueSnackbar('Customer updated successfully!');
        navigate(PATH_PORTAL_REGISTRATION.view(customerId));
      } catch (err) {
        if (err?.errors && Array.isArray(err?.errors)) {
          err?.errors?.forEach((error) => {
            if (error?.field && error?.message) {
              setError(error?.field, {
                type: 'manual',
                message: error?.message
              });
            }
          });
        } else {
          enqueueSnackbar( typeof err === 'string' ? err : 'Registration Update Failed!', { variant: `error` });
        }
      }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container>
        <Grid item xs={12} md={12}>
          <Stack spacing={2}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormLabel content="Edit Portal Registration Request" />
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >

                  <RHFTextField name="customerName" label="Customer Name*" />
                  <RHFChipsInput name="machineSerialNos" label="Machine Serial Nos*" />
                  <RHFTextField name="contactPersonName" label="Contact Person Name" />
                  <RHFAutocomplete
                    name="status"
                    label="Status"
                    options={ [ "NEW", "APPROVED", "REJECTED", "PENDING" ] }
                    filterSelectedOptions
                  />
                  <RHFTextField name="email" label="Email*" 
                    disabled={ portalRegistration?.status?.toLowerCase() === 'approved' } 
                  />
                  <RHFTextField name="phoneNumber" label="Phone Number" />
                  <RHFCountryAutocomplete name="country" label="Country" disableDefaultValue />
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}
                >
                  <RHFTextField name="address" label="Address" />
                  <RHFTextField name="customerNote" label="Customer Note" />
                </Box>
                <RHFTextField name="internalNote" label="Internal Note" />
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
