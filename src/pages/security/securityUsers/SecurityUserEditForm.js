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
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFPhoneInput } from '../../../components/hook-form';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { updateSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import { getAllActiveCustomers, resetAllActiveCustomers } from '../../../redux/slices/customer/customer';
import { getActiveContacts, resetActiveContacts } from '../../../redux/slices/customer/contact';
import { getAllMachines, resetAllMachines } from '../../../redux/slices/products/machine';
import { getActiveRoles, resetActiveRoles } from '../../../redux/slices/securityUser/role';
import { getActiveRegions, resetActiveRegions } from '../../../redux/slices/region/region';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { editUserSchema } from '../../schemas/securityUser';

// ----------------------------------------------------------------------

export default function SecurityUserEditForm() {

  const { securityUser } = useSelector((state) => state.user);
  const { activeRoles } = useSelector((state) => state.role);
  const { activeRegions } = useSelector((state) => state.region);
  const { allMachines } = useSelector((state) => state.machine)
  const { allActiveCustomers } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);
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
    }
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      customer: securityUser?.customer || null,
      contact: securityUser?.contact || null,
      name: securityUser?.name || '',
      phone: securityUser?.phone || '+64 ',
      email: securityUser?.email || '',
      loginEmail: securityUser?.login || '',
      roles: securityUser?.roles || [],
      dataAccessibilityLevel: securityUser?.dataAccessibilityLevel || 'RESTRICTED',
      regions: securityUser?.regions || [],
      customers: securityUser?.customers || [],
      machines: securityUser?.machines || [],
      isActive: securityUser?.isActive,
      multiFactorAuthentication: securityUser?.multiFactorAuthentication,
      // currentEmployee: securityUser?.currentEmployee
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [securityUser]
  );

  const methods = useForm({
    resolver: yupResolver(editUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { customer, customers } = watch();


  useEffect(() => {
    if (customer?._id) {
      dispatch(getActiveContacts(customer?._id));
    } else {
      dispatch(resetActiveContacts());
    }
  }, [dispatch, customer?._id]);

  useEffect(() => {
    if (customer && customer?.type?.toUpperCase() !== 'SP') {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [customer, setValue])

  const onChangeContact = (contact) => {
    if (contact?._id) {
      setValue('name', `${contact?.firstName || ''} ${contact?.lastName || ''}`);
      setValue('phone', contact?.phone);
      setValue('email', contact?.email);
      setValue('contact', contact);
    } else {
      setValue('name', '');
      setValue('phone', '');
      setValue('email', '');
      setValue('contact', null);
    }
  }


  const onSubmit = async (data) => {
    try {
      const phoneRegex = /^\+\d+$/;
      if (!data.phone || phoneRegex.test(data.phone.trim())) {
        data.phone = '';
      }
      await dispatch(updateSecurityUser(data, securityUser._id));
      await reset();
      await navigate(PATH_SETTING.security.users.view(securityUser._id));
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => { navigate(PATH_SETTING.security.users.view(securityUser._id)) };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container >
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2} >
              <FormLabel content='Personal Information' />
              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >

                <RHFAutocomplete
                  disabled
                  name='customer'
                  label="Customer*"
                  options={allActiveCustomers}
                  getOptionLabel={(option) => option?.name || ''}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li  {...props} key={option?._id}>{option?.name || ''}</li>)}
                />

                <RHFAutocomplete
                  name='contact'
                  label="Contact*"
                  options={activeContacts}
                  onChange={(event, newValue) => onChangeContact(newValue)}
                  getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li  {...props} key={option?._id}>{option?.firstName || ''}{' '}{option?.lastName || ''}</li>)}
                />

                <RHFTextField name="name" label="Full Name*" />

                <RHFPhoneInput name="phone" label="Phone Number" inputProps={{ maxLength: 13 }} />

              </Box>
              <Box rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
              >
                <RHFTextField name="email" label="Email Address*" inputProps={{ style: { textTransform: 'lowercase' } }} />
                <RHFTextField name="loginEmail" label="Login Email" disabled inputProps={{ style: { textTransform: 'lowercase' } }} />
              </Box>
              <FormLabel content='Accessibility Information' />
              <Box
                rowGap={2} columnGap={2} display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >

                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="roles"
                  label="Roles"
                  options={activeRoles.filter(role =>
                    (customer?.type?.toLowerCase() === 'sp' ? role?.roleType?.toLowerCase() !== 'customer' : (role?.roleType?.toLowerCase() === 'customer'))
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
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(1, 1fr)',
                }}
              >

                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  disabled={isDisabled}
                  name="regions"
                  label="Regions"
                  options={activeRegions}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {option?.name || ''} </li>)}
                  ChipProps={{ size: 'small' }}
                />

                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  disabled={isDisabled}
                  name="customers"
                  label="Customers"
                  options={allActiveCustomers}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {option?.name || ''} </li>)}
                  ChipProps={{ size: 'small' }}
                />

                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  disabled={isDisabled}
                  name="machines"
                  label="Machines"
                  options={allMachines?.filter(m => customers?.some(c => c?._id === m.customer?._id))}
                  getOptionLabel={(option) => `${option.serialNo} ${option.name ? '-' : ''} ${option?.name || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.serialNo || ''} ${option.name ? '-' : ''} ${option.name || ''}`}</li>)}
                  ChipProps={{ size: 'small' }}
                />

              </Box>
              <Grid item md={12} display="flex">
                <RHFSwitch name="isActive" label="Active" />
                <RHFSwitch name="multiFactorAuthentication" label="Multi-Factor Authentication" />
              </Grid>

              <Stack sx={{ mt: 3 }}>
                <AddFormButtons securityUserPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
