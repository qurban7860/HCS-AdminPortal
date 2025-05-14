import PropTypes from 'prop-types';
import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Checkbox } from '@mui/material';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// assets
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFPasswordField, RHFAutocomplete, RHFPhoneInput } from '../../../components/hook-form';
// slice
import { addSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import { getAllActiveCustomers, resetAllActiveCustomers } from '../../../redux/slices/customer/customer';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
import { getAllMachines, resetAllMachines } from '../../../redux/slices/products/machine';
import { getActiveRoles, resetActiveRoles } from '../../../redux/slices/securityUser/role';
import { getActiveRegions, resetActiveRegions } from '../../../redux/slices/region/region';
import { addUserSchema, editUserSchema } from '../../schemas/securityUser';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { postSecurityUserInvitation } from '../../../redux/slices/securityUser/invite';

SecurityUserAddForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  isInvite: PropTypes.bool,
};

export default function SecurityUserAddForm({ isEdit = false, currentUser, isInvite }) {
  const { allowedModules } = useSelector((state) => state.user);
  const { allActiveCustomers } = useSelector((state) => state.customer);
  const { activeRoles } = useSelector((state) => state.role);
  const { activeRegions } = useSelector((state) => state.region);
  const { activeContacts } = useSelector((state) => state.contact);
  const { allMachines } = useSelector((state) => state.machine);
  const [isDisabled, setIsDisabled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    dispatch(getAllActiveCustomers());
    dispatch(getAllMachines());
    dispatch(getActiveRegions());
    dispatch(getActiveRoles());
    return () => {
      dispatch(resetAllActiveCustomers());
      dispatch(resetAllMachines());
      dispatch(resetActiveRegions());
      dispatch(resetActiveRoles());
      dispatch(resetActiveContacts());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);


  const defaultValues = useMemo(
    () => ({
      customer: null,
      contact: null,
      name: '',
      phone: '+64 ',
      email: '',
      password: '',
      confirmPassword: '',
      roles: [],
      modules: [],
      regions: [],
      customers: [],
      machines: [],
      dataAccessibilityLevel: 'RESTRICTED',
      isActive: true,
      isInvite,
      multiFactorAuthentication: false,
      // currentEmployee: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  );
  // isInvite && editUserSchema || !isInvite && 
  const methods = useForm({
    resolver: yupResolver(isInvite && editUserSchema || !isInvite && addUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { contact, customer } = watch();

  useEffect(() => {
    const howickCustomer = allActiveCustomers.find(c => c?.type?.toUpperCase() === "SP")
    setValue('customer', howickCustomer);
    if (howickCustomer?._id) {
      dispatch(getActiveContacts(howickCustomer?._id));
    }
  }, [allActiveCustomers, setValue, dispatch])

  useEffect(() => {
    if (customer && customer?.type?.toUpperCase() !== 'SP') {
      setIsDisabled(true);
      setValue('dataAccessibilityLevel', 'RESTRICTED');
      setValue('customers', [{ _id: customer?._id, name: customer?.name }]);
    } else {
      setIsDisabled(false);
      setValue('customers', []);
      setValue('dataAccessibilityLevel', 'RESTRICTED');
    }
    if (customer?._id !== contact?.customer?._id) {
      setValue('name', '');
      setValue('phone', '');
      setValue('email', '');
    }
    setValue('machines', []);
    setValue('regions', []);
    setValue('roles', []);
  }, [customer, contact, setValue])

  useEffect(() => {
    if (contact?._id) {
      setValue('name', `${contact?.firstName || ''} ${contact?.lastName || ''}`);
      setValue('phone', contact?.phone);
      setValue('email', contact?.email);
    } else {
      setValue('name', '');
      setValue('phone', '');
      setValue('email', '');
    }
  }, [dispatch, contact, setValue]);

  const onSubmit = async (data) => {
    try {
      const phoneRegex = /^\+\d+$/;
      if (!data.phone || phoneRegex.test(data.phone.trim())) {
        data.phone = '';
      }
      let message;
      let response;
      if (!isInvite) {
        message = "User Added Successfully";
        response = await dispatch(addSecurityUser(data));
      } else {
        message = "User Invitation Sent Successfullfy";
        response = await dispatch(postSecurityUserInvitation(data));
      }
      reset();
      enqueueSnackbar(message);
      if (!isInvite) {
        navigate(PATH_SETTING.security.users.view(response.data.user._id));
      }
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => navigate(PATH_SETTING.security.root);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2} >
              <FormLabel content='Personal Information' />
              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <RHFAutocomplete
                  name='customer'
                  label="Customer*"
                  options={allActiveCustomers}
                  getOptionLabel={(option) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li  {...props} key={option?._id}>{option?.name || ''}</li>)}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setValue('customer', newValue)
                      dispatch(resetActiveContacts());
                      dispatch(getActiveContacts(newValue?._id));
                      if (newValue?._id !== contact?.customer?._id) {
                        setValue('contact', null)
                      }
                    } else {
                      setValue('customer', null)
                      setValue('contact', null)
                      dispatch(resetActiveContacts());
                    }
                  }}
                />

                <RHFAutocomplete
                  name='contact'
                  label="Contact*"
                  options={activeContacts}
                  getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li  {...props} key={option?._id}>{option?.firstName || ''}{' '}{option?.lastName || ''}</li>)}
                />

                <RHFTextField name="name" label="Full Name*" />
                <RHFPhoneInput name="phone" label="Phone Number" />
              </Box>

              <Box
                rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
                <RHFTextField name="email" label="Login/Email Address*" inputProps={{ style: { textTransform: 'lowercase' } }} />
              </Box>
              {(!isInvite && (
                <Box sx={{ mb: 3 }} rowGap={2} columnGap={2} display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', }}
                >
                  <RHFPasswordField name="password" label="Password*" />
                  <RHFPasswordField name="confirmPassword" label="Confirm Password*" />
                </Box>
              ))}
              <FormLabel content='Accessibility Information' />
              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >

                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="roles"
                  label="Roles*"
                  options={activeRoles.filter(role =>
                  (customer?.type?.toLowerCase() === 'sp' ?
                    role?.roleType?.toLowerCase() !== 'customer'
                    : role?.roleType?.toLowerCase() === 'customer')
                  )}
                  getOptionLabel={(option) => `${option?.name || ''} `}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option, { selected }) => (<li {...props}> <Checkbox checked={selected} />{option?.name || ''}</li>)}
                />

                <RHFAutocomplete
                  disableClearable
                  disabled={isDisabled}
                  name="dataAccessibilityLevel"
                  label="Data Accessibility Level"
                  options={['RESTRICTED', 'GLOBAL']}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option, { selected }) => (<li {...props}> <Checkbox checked={selected} />{option || ''}</li>)}
                />

              </Box>
              {customer?.type?.toLowerCase() !== 'sp' &&
                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="modules"
                  label="Modules Access*"
                  options={allowedModules}
                />}
              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
                <RHFAutocomplete
                  multiple
                  disabled={isDisabled}
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="regions"
                  label="Regions"
                  options={activeRegions}
                  getOptionLabel={(option) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {option?.name || ''} </li>)}
                  ChipProps={{ size: 'small' }}
                />

                <RHFAutocomplete
                  multiple
                  disabled={isDisabled}
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="customers"
                  label="Customers"
                  options={allActiveCustomers}
                  getOptionLabel={(option) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {option?.name || ''} </li>)}
                  ChipProps={{ size: 'small' }}
                />

                <RHFAutocomplete
                  multiple
                  disabled={isDisabled}
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="machines"
                  label="Machines"
                  options={allMachines}
                  getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.serialNo || ''} ${option.name ? '-' : ''} ${option.name || ''}`}</li>)}
                  ChipProps={{ size: 'small' }}
                />

              </Box>
              <Grid item md={12} display="flex">
                {(!isInvite && (
                  <>
                    <RHFSwitch name="isActive" label="Active" />
                    <RHFSwitch name="multiFactorAuthentication" label="Multi-Factor Authentication" />
                  </>
                ))}
              </Grid>
              <Stack sx={{ mt: 3 }}>
                <AddFormButtons securityUserPage saveButtonName={isInvite ? "Invite" : "Save"} isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
