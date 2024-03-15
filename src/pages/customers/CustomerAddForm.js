import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack } from '@mui/material';
// slice
import { addCustomer } from '../../redux/slices/customer/customer';
import { getActiveSPContacts, resetActiveSPContacts } from '../../redux/slices/customer/contact';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFAutocomplete,
  RHFTextField,
  RHFCountryAutocomplete,
  RHFChipsInput,
  RHFPhoneInput,
  RHFCheckbox,
} from '../../components/hook-form';
import { MotionContainer, varBounce } from '../../components/animate';
// util
import { Cover } from '../../components/Defaults/Cover';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { FORMLABELS } from '../../constants/customer-constants';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { AddCustomerSchema } from '../schemas/customer';

// ----------------------------------------------------------------------

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object
}

export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const { activeSpContacts } = useSelector((state) => state.contact);

  useLayoutEffect(() => {
    dispatch(getActiveSPContacts());
    return () => { resetActiveSPContacts() }
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      // Customer detail
      name: '',
      code:'',
      tradingName: [],
      phone: '',
      fax: '',
      email: '',
      website: '',
      // Address Information
      street: '',
      suburb: '',
      city: '',
      postcode: '',
      region: '',
      country: null,
      // Billing Information
      billingContactFirstName: '',
      billingContactLastName: '',
      billingContactTitle: '',
      billingContactPhone: '+64 ',
      billingContactEmail: '',
      // Is Same Contact
      isSameContact: true,
      // Technical Information
      technicalContactFirstName: '',
      technicalContactLastName: '',
      technicalContactTitle: '',
      technicalContactPhone: '+64 ',
      technicalContactEmail: '',
      // Account Information
      accountManager: [],
      projectManager: [],
      supportManager: [],
      type: 'Customer',
      isActive: true,
      supportSubscription:true,
      isFinancialCompany: false,
      excludeReports:false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [AddCustomerSchema]
  );

  const methods = useForm({
    resolver: yupResolver(AddCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { isSameContact } = watch();
  
  const toggleCancel = () => navigate(PATH_CUSTOMER.list);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(addCustomer(data));
      reset();
      enqueueSnackbar('Customer added successfully!');
      navigate(PATH_CUSTOMER.view(response.data.Customer._id));
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }} >
        <Cover name="New Customer" icon="mdi:user" />
      </Card>
      <Grid sx={{ mt: 3 }}>
        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 5fr 1fr)' }}
            >
              <RHFTextField name="name" label={FORMLABELS.CUSTOMER.NAME.label} />
              <RHFTextField name="code" label={FORMLABELS.CUSTOMER.CODE.label} />
            </Box>

            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
            >
              <RHFChipsInput name="tradingName" label="Trading Name"  />
            </Box>

            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <RHFPhoneInput name="phone" label="Phone Number"  />
              <RHFPhoneInput name="fax" label="Fax" />
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="website" label="Website" />
            </Box>
          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <FormLabel content={FORMLABELS.CUSTOMER.ADDRESSINFORMATION} />
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <RHFTextField name="street" label="Street" />
              <RHFTextField name="suburb" label="Suburb" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="postcode" label="Post Code" />
              <RHFTextField name="region" label="Region" />
              <RHFCountryAutocomplete name="country" label="Country" />
            </Box>
          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <FormLabel content={FORMLABELS.CUSTOMER.BILLINGCONTACTINFORMATION} />
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <RHFTextField name="billingContactFirstName" label="First Name" />
              <RHFTextField name="billingContactLastName" label="Last Name" />
              <RHFTextField name="billingContactTitle" label="Billing Contact Title" />
              <RHFPhoneInput name="billingContactPhone" label="Billing Contact Phone Number" />
              <RHFTextField name="billingContactEmail" label="Billing Contact Email" />
            </Box>
          </Stack>
        </Card>

        <Card component={MotionContainer} sx={{ p: 3, mb: 3 }}>
          <m.div variants={varBounce().in}>
                <FormLabel  content={FORMLABELS.CUSTOMER.TECHNICALCONTACTINFORMATION} />
                <RHFCheckbox name="isSameContact" label="Same as billing contact" />
              {!isSameContact && (
                <Box
                  rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField  name="technicalContactFirstName" label="First Name" />
                  <RHFTextField  name="technicalContactLastName"  label="Last Name" />
                  <RHFTextField  name="technicalContactTitle"     label="Technical Contact Title" />
                  <RHFPhoneInput name="technicalContactPhone"     label="Technical Contact Phone Number" />
                  <RHFTextField  name="technicalContactEmail"     label="Technical Contact Email" />
                </Box>
              )}
          </m.div>
        </Card>
        <Grid container spacing={2}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <FormLabel content={FORMLABELS.CUSTOMER.HOWICKRESOURCESS} />
                <Box
                  rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="accountManager"
                    label="Account Manager"
                    options={activeSpContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="projectManager"
                    label="Project Manager"
                    options={activeSpContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    ChipProps={{ size: 'small' }}
                  />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="supportManager"
                    label="Support Manager"
                    options={activeSpContacts}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.firstName || ''} ${ option.lastName || ''}`}
                    renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li> )}
                    ChipProps={{ size: 'small' }}
                  />

                </Box>
                <Grid sx={{display:{md:'flex'}}}>
                    <RHFSwitch name="isActive" label="Active" checked={defaultValues?.isActive} />
                    <RHFSwitch name="supportSubscription" label='Support Subscription' checked={defaultValues?.supportSubscription} />
                    <RHFSwitch name="isFinancialCompany" label="Financing Company" defaultChecked={defaultValues?.isFinancialCompany} />
                    <RHFSwitch name="excludeReports" label="Exclude Reporting" defaultChecked={defaultValues?.excludeReports} />
                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
