import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container, Checkbox, Collapse } from '@mui/material';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFAutocomplete, RHFPhoneInput } from '../../../components/hook-form';
// slice
import { updateSecurityUser, getSecurityUser } from '../../../redux/slices/securityUser/securityUser';
import { getAllActiveCustomers, resetAllActiveCustomers } from '../../../redux/slices/customer/customer';
import { getActiveContacts, resetActiveContacts} from '../../../redux/slices/customer/contact';
import { getAllMachines, resetAllMachines } from '../../../redux/slices/products/machine';
import { getActiveRoles, resetActiveRoles } from '../../../redux/slices/securityUser/role';
import { getActiveRegions, resetActiveRegions } from '../../../redux/slices/region/region';
// current user
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { editUserSchema } from '../../schemas/securityUser';
import { useAuthContext } from '../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function SecurityUserProfileEditForm() {

  const { activeRoles } = useSelector((state) => state.role);
  const { securityUser } = useSelector((state) => state.user);
  const { activeRegions } = useSelector((state) => state.region);
  const { allMachines } = useSelector((state) => state.machine)
  const { allActiveCustomers } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);
  const { isSecurityReadOnly } = useAuthContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    dispatch(getAllActiveCustomers());
    dispatch(getActiveRegions());
    dispatch(getAllMachines());
    dispatch(getActiveRoles());
    return ()=> { 
      dispatch(resetAllActiveCustomers());
      dispatch(resetActiveRegions()); 
      dispatch(resetAllMachines());
      dispatch(resetActiveRoles()); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      currentEmployee: securityUser?.currentEmployee
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [securityUser]
  );
  const methods = useForm({
    resolver: yupResolver( editUserSchema ),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { customer, dataAccessibilityLevel } = watch();

  useEffect(() => {
    if (dataAccessibilityLevel === 'GLOBAL') {
        setValue('regions', []);
        setValue('customers', []);
        setValue('machines', []);
        setIsGlobal(true)
      } else {
        setIsGlobal(false)
      }
  }, [dataAccessibilityLevel, setValue]);


  useEffect(() => {
    if(customer?._id){
      dispatch(getActiveContacts(customer?._id));
    } else {
      dispatch(resetActiveContacts());
    }
  }, [ dispatch,customer?._id ]);


  const onSubmit = async (data) => {
    try {
      await  dispatch(updateSecurityUser(data, securityUser._id));
      reset()
      navigate(PATH_SETTING.security.users.profile);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => navigate(PATH_SETTING.security.users.profile);


  const onChangeContact = (contact) => {
    if(contact?._id){
      setValue( 'name', `${contact?.firstName || ''} ${contact?.lastName || ''}` );
      setValue( 'phone', contact?.phone );
      setValue( 'email', contact?.email );
      setValue( 'contact', contact );
    } else {
      setValue( 'name', '' );
      setValue( 'phone', '' );
      setValue( 'email', '' );
      setValue( 'contact', null );
    }
  }

  return (
    <Container maxWidth={false}>
        <Card sx={{ mb: 3, height: 160, position: 'relative' }} >
          <Cover name="Edit Profile" icon="ph:users-light" />
        </Card>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
          <Stack spacing={2} >  
            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', }}
            >
              <RHFAutocomplete
                disabled
                name='customer'
                label="Customer"
                options={ allActiveCustomers }
                getOptionLabel={(option) => option?.name || ''}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderOption={(props, option) => (<li  {...props} key={option?._id}>{option?.name || ''}</li>)}
              />

              <RHFAutocomplete
                disabled
                name='contact'
                label="Contact"
                options={activeContacts}
                onChange={(event, newValue) => onChangeContact(newValue) }
                getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderOption={(props, option) => (<li  {...props} key={option?._id}>{option?.firstName || ''}{' '}{option?.lastName || ''}</li>)}
              />

              <RHFTextField name="name" label="Full Name*" />

              <RHFPhoneInput name="phone" label="Phone Number" inputProps={{maxLength:13}} />
            </Box>

            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' }}
            >
                  <RHFTextField name="email" label="Email Address" inputProps={{ style: { textTransform: 'lowercase' } }} />
                  <RHFTextField name="loginEmail" label="Login Email" disabled />
            </Box>

            <Box
              rowGap={2} columnGap={2} display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >

              <RHFAutocomplete
                disabled={ isSecurityReadOnly }
                multiple
                disableCloseOnSelect
                filterSelectedOptions
                name="roles"
                label="Roles"
                options={ activeRoles }
                getOptionLabel={(option) => `${option?.name || ''} `}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                renderOption={(props, option, { selected }) => ( <li {...props}> <Checkbox checked={selected} />{option?.name || ''}</li> )}
              />
              
              <RHFAutocomplete
                disabled={ isSecurityReadOnly }
                disableClearable
                name="dataAccessibilityLevel"
                label="Data Accessibility Level"
                options={ [ 'RESTRICTED', 'GLOBAL' ] }
                isOptionEqualToValue={(option, value) => option === value}
                renderOption={(props, option, { selected }) => ( <li {...props}> <Checkbox checked={selected} />{option|| ''}</li> )}
              />

            </Box>
            <Collapse in={!isGlobal} timeout="auto">
              <Stack spacing={2} >

                <RHFAutocomplete
                  disabled={ !isGlobal }
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="regions" 
                  label="Regions"
                  options={activeRegions}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}> {option?.name || ''} </li>)}
                  ChipProps={{ size: 'small' }}
                />

                <RHFAutocomplete
                  multiple
                  disableCloseOnSelect
                  filterSelectedOptions
                  disabled={ !isGlobal }
                  name="customers" 
                  label="Customers"
                  options={allActiveCustomers}
                  getOptionLabel={(option) => option.name}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}> {option?.name || ''} </li> )}
                  ChipProps={{ size: 'small' }}
                />

                <RHFAutocomplete
                  multiple
                  disabled={ !isGlobal }
                  disableCloseOnSelect
                  filterSelectedOptions
                  name="machines" 
                  label="Machines"
                  options={allMachines}
                  getOptionLabel={(option) => `${option.serialNo} ${option.name ? '-' : ''} ${option?.name || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.serialNo || ''} ${option.name ? '-' : ''} ${option.name || ''}`}</li>)}
                  ChipProps={{ size: 'small' }}
                />
              </Stack>
            </Collapse>
            <Grid item md={12} display="flex">
              <RHFSwitch name="isActive" disabled label="Active" />
              <RHFSwitch name="multiFactorAuthentication" label="Multi-Factor Authentication" />
              <RHFSwitch name="currentEmployee" disabled label="Current Employee" />
            </Grid>

            <Stack sx={{ mt: 3 }}>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Stack>
          </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    </Container>
  );
}
