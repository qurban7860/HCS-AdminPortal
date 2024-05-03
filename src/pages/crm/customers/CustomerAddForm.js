import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { useLayoutEffect, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { Box, Card, Grid, Stack, IconButton, Typography } from '@mui/material';
// slice
import { addCustomer } from '../../../redux/slices/customer/customer';
import { getActiveSPContacts, resetActiveSPContacts } from '../../../redux/slices/customer/contact';
// routes
import { PATH_CRM } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFAutocomplete,
  RHFTextField,
  RHFCountryAutocomplete,
  RHFChipsInput,
  RHFCustomPhoneInput,
  RHFCheckbox,
} from '../../../components/hook-form';
import { MotionContainer, varBounce } from '../../../components/animate';
// util
import { Cover } from '../../../components/Defaults/Cover';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { FORMLABELS } from '../../../constants/customer-constants';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { AddCustomerSchema } from '../../schemas/customer';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';

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
  const theme = createTheme({ palette: { success: green } });
  const { activeSpContacts } = useSelector((state) => state.contact);

  const PHONE_TYPES_ = JSON.parse( localStorage.getItem('configurations'))?.find( ( c )=> c?.name === 'PHONE_TYPES' )
  let PHONE_TYPES = ['Mobile', 'Home', 'Work', 'Fax', 'Others'];
  if(PHONE_TYPES_) {
    PHONE_TYPES = PHONE_TYPES_?.value?.split(',')?.map(item => item?.trim());
  }

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
      ref: '',
      phoneNumbers: [
        { type: PHONE_TYPES[0], countryCode: '64' },
        { type: PHONE_TYPES[0], countryCode: '64' },
      ],
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
      billingContactPhone: { type: PHONE_TYPES[0], countryCode: '64' },
      billingContactEmail: '',
      // Is Same Contact
      isTechnicalContactSameAsBillingContact: true,
      // Technical Information
      technicalContactFirstName: '',
      technicalContactLastName: '',
      technicalContactTitle: '',
      technicalContactPhone: { type: PHONE_TYPES[0], countryCode: '64' },
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
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { isTechnicalContactSameAsBillingContact, phoneNumbers, country, billingContactPhone, technicalContactPhone } = watch();

  const addContactNumber = () => {
    const updatedPhoneNumbers = [
      ...phoneNumbers,
      { type: '', countryCode: country?.phone?.replace(/[^0-9]/g, '') },
    ];
    setValue('phoneNumbers', updatedPhoneNumbers);
  };

  const removeContactNumber = (indexToRemove) => {
    setValue('phoneNumbers', phoneNumbers?.filter((_, index) => index !== indexToRemove) || []);
  };

  const toggleCancel = () => navigate(PATH_CRM.customers.list);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(addCustomer(data));
      reset();
      enqueueSnackbar('Customer added successfully!');
      navigate(PATH_CRM.customers.view(response.data.Customer._id));
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
    }
  };

  useEffect(() => {
    phoneNumbers?.forEach((pN, index) => {
      if(!phoneNumbers[index]?.contactNumber || phoneNumbers[index]?.contactNumber === undefined ){
        setValue( `phoneNumbers[${index}].countryCode`,  country?.phone?.replace(/[^0-9]/g, '') )
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ country ]);

  const updateCountryCode = () =>{
    phoneNumbers?.forEach((pN, index ) =>  setValue( `phoneNumbers[${index}].countryCode`,  country?.phone?.replace(/[^0-9]/g, '') ))
  }

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
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 5fr 1fr)' }}
            >
              <RHFTextField name="name" label={FORMLABELS.CUSTOMER.NAME.label} />
              <RHFTextField name="code" label={FORMLABELS.CUSTOMER.CODE.label} />
            </Box>

              <RHFChipsInput name="tradingName" label="Trading Name"  />

            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <RHFTextField name="ref" label="Reference Number"  />
            </Box>
              {/* 
                  <RHFPhoneInput name="phone" label="Phone Number"  />
                  <RHFPhoneInput name="fax" label="Fax" /> 
                */}

          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <FormLabel content={FORMLABELS.CUSTOMER.ADDRESSINFORMATION} />
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <RHFTextField name="street" label="Street" />
              <RHFTextField name="suburb" label="Suburb" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="region" label="Region" />
              <RHFTextField name="postcode" label="Post Code" />
              <RHFCountryAutocomplete name="country" label="Country" />
            </Box>
            <Box display="flex" alignItems="center" gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }} >
              <IconButton onClick={updateCountryCode} size="small" variant="contained" color='secondary' sx={{ mr: 0.5}} >
                <Iconify icon="icon-park-outline:update-rotation" sx={{width: 25, height: 25}}  />
              </IconButton>
              <Typography variant='body2' sx={{ color:'gray'}}>Update country code in phone/fax.</Typography>
            </Box>
              <Grid>
                {phoneNumbers?.map((pN, index) => (
                  <Grid sx={{ py: 1 }} display="flex" alignItems="center">
                    <RHFCustomPhoneInput
                      name={`phoneNumbers[${index}]`}
                      value={pN}
                      label={pN?.type || 'Contact Number'}
                      index={index}
                    />
                    <IconButton
                      disabled={phoneNumbers?.length === 1}
                      onClick={() => removeContactNumber(index)}
                      size="small"
                      variant="contained"
                      color="error"
                      sx={{ mx: 1 }}
                    >
                      <StyledTooltip
                        title="Remove Contact Number"
                        placement="top"
                        disableFocusListener
                        tooltipcolor={theme.palette.error.main}
                        color={
                          phoneNumbers?.length > 1
                            ? theme.palette.error.main
                            : theme.palette.text.main
                        }
                      >
                        <Iconify icon="icons8:minus" sx={{ width: 25, height: 25 }} />
                      </StyledTooltip>
                    </IconButton>
                  </Grid>
                ))}
                <Grid>
                  <IconButton
                    disabled={phoneNumbers?.length > 9}
                    onClick={addContactNumber}
                    size="small"
                    variant="contained"
                    color="success"
                    sx={{ ml: 'auto', mr: 1 }}
                  >
                    <StyledTooltip
                      title="Add Contact Number"
                      placement="top"
                      disableFocusListener
                      tooltipcolor={theme.palette.success.dark}
                      color={
                        phoneNumbers?.length < 10
                        ? theme.palette.success.dark
                        : theme.palette.text.main
                      }
                    >
                      <Iconify icon="icons8:plus" sx={{ width: 25, height: 25 }} />
                    </StyledTooltip>
                  </IconButton>
                </Grid>
              </Grid>
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <RHFTextField name="email" label="Email" />
              <RHFTextField name="website" label="Website" />
            </Box>
          </Stack>
        </Card>

        <Card sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            <FormLabel content={FORMLABELS.CUSTOMER.BILLINGCONTACTINFORMATION} />
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              <RHFTextField name="billingContactFirstName" label="First Name" />
              <RHFTextField name="billingContactLastName" label="Last Name" />
              <RHFTextField name="billingContactTitle" label="Billing Contact Title" />
              <RHFCustomPhoneInput name="billingContactPhone" label="Billing Contact Phone Number" value={billingContactPhone} />
              {/* <RHFPhoneInput name="billingContactPhone" label="Billing Contact Phone Number" /> */}
              <RHFTextField name="billingContactEmail" label="Billing Contact Email" />
            </Box>
          </Stack>
        </Card>

        <Card component={MotionContainer} sx={{ p: 3, mb: 3 }}>
          <m.div variants={varBounce().in}>
                <FormLabel  content={FORMLABELS.CUSTOMER.TECHNICALCONTACTINFORMATION} />
                <RHFCheckbox name="isTechnicalContactSameAsBillingContact" label="Same as billing contact" />
              {!isTechnicalContactSameAsBillingContact && (
                <Box
                  rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField  name="technicalContactFirstName" label="First Name" />
                  <RHFTextField  name="technicalContactLastName"  label="Last Name" />
                  <RHFTextField  name="technicalContactTitle"     label="Technical Contact Title" />
                  <RHFCustomPhoneInput name="technicalContactPhone" label="Technical Contact Phone Number" value={technicalContactPhone} />
                  {/* <RHFPhoneInput name="technicalContactPhone" label="Technical Contact Phone Number" /> */}
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
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
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
