import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput } from 'mui-tel-input';
import { Box, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
// routes
import { PATH_SECURITY } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFMultiSelect } from '../../components/hook-form';
// slice
import {
  updateSecurityUser,
} from '../../redux/slices/securityUser/securityUser';
import { getAllCustomers } from '../../redux/slices/customer/customer';
import { getActiveContacts, resetContacts } from '../../redux/slices/customer/contact';
import { getAllMachines } from '../../redux/slices/products/machine';
import { getRoles } from '../../redux/slices/securityUser/role';
import { getActiveRegions } from '../../redux/slices/region/region';
// current user
import AddFormButtons from '../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function SecurityUserEditForm() {
  const userRolesString = localStorage.getItem('userRoles');
  const ROLES = [];
  // const userRoles = JSON.parse(userRolesString);
  const [userRoles] = useState(JSON.parse(userRolesString));
  const { roles } = useSelector((state) => state.role);
  const { securityUser } = useSelector((state) => state.user);
  const { activeRegions } = useSelector((state) => state.region);
  const { allMachines } = useSelector((state) => state.machine)
  const { allCustomers } = useSelector((state) => state.customer);
 
  const securityUserRoles = [];
  roles.map((role) => ROLES.push({ value: role?._id, label: role.name }));
  if (securityUser?.roles) {
    securityUser?.roles.map((role) => securityUserRoles.push(role?._id, role.name));
  }
  
  const [roleTypesDisabled, setDisableRoleTypes] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  // const [filteredCustomers, setFilteredCustomers] = useState(spCustomers);
  // const [filteredMachines, setFilteredMachines] = useState(allMachines);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [customerVal, setCustomerVal] = useState('');
  const [customersArr, setCustomerArr] = useState([]);
  const [machinesArr, setMachineArr] = useState([]);
  const { activeContacts } = useSelector((state) => state.contact);
  const [contactVal, setContactVal] = useState('');
  const [phone, setPhone] = useState('');
  const [sortedRoles, setSortedRoles] = useState([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();


  useLayoutEffect(() => {
    // dispatch(getActiveSPCustomers());
    dispatch(getAllCustomers());
    dispatch(getAllMachines());
    dispatch(getActiveRegions());
    dispatch(getRoles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (customerVal) {
      dispatch(getActiveContacts(customerVal._id));
    }
    if (userRoles) {
      if (userRoles.some((role) => role?.roleType === 'SuperAdmin')) {
        setDisableRoleTypes(false);
      } else {
        setDisableRoleTypes(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    dispatch,
    customerVal,
    // userRoles
  ]);

  useEffect(() => {
    const mappedRoles = roles.map((role) => ({
      value: role?._id,
      label: role.name,
    }));

    const sortedRolesTemp = [...mappedRoles].sort((a, b) => {
      const nameA = a.label.toUpperCase();
      const nameB = b.label.toUpperCase();
      return nameA.localeCompare(nameB);
    });

    setSortedRoles(sortedRolesTemp);
  }, [roles]);

  /* eslint-disable */
  useEffect(() => {
    if (securityUser?.customer !== undefined && securityUser?.customer !== null) {
      setCustomerVal(securityUser?.customer);
    }
    if (securityUser?.contact !== undefined && securityUser?.contact !== null) {
      setContactVal(securityUser?.contact);
    }
    if (securityUser?.phone !== undefined && securityUser?.phone !== null) {
      setPhone(securityUser?.phone);
    }
    if (securityUser?.name !== undefined && securityUser?.name !== null) {
      handleNameChange(securityUser?.name);
    }
    if (securityUser?.email !== undefined && securityUser?.email !== null) {
      setEmail(securityUser?.email);
    }
    if (securityUser?.customers !== undefined && securityUser?.customers.length > 0) {
      const selectedCustomerIds = securityUser?.customers.map((customer) => customer._id);
      setCustomerArr(allCustomers.filter((customer) => selectedCustomerIds.includes(customer._id)));
    }
    if (securityUser?.machines !== undefined && securityUser?.machines.length > 0) {
      const selectedMachineIds = securityUser?.machines.map((machine) => machine._id);
      setMachineArr(allMachines.filter((machine) => selectedMachineIds.includes(machine._id)));

    }
    if (securityUser?.regions !== undefined && securityUser?.regions.length > 0) {
      const selectedRegionIds = securityUser?.regions.map((region) => region._id);
      setSelectedRegions(activeRegions.filter((region) => selectedRegionIds.includes(region._id)));
    }
  }, [securityUser]);
  /* eslint-enable */

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address').trim(),
    password: Yup.string().min(6),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    roles: Yup.array().required('Role is required').nullable(),
    isActive: Yup.boolean(),
    multiFactorAuthentication: Yup.boolean(),
    currentEmployee: Yup.boolean()
  });

  const defaultValues = useMemo(
    () => ({
      id: securityUser?._id || '',
      name: securityUser?.name || '',
      email: email || '',
      roles: securityUserRoles || [],
      loginEmail: securityUser?.login,
      isActive: securityUser?.isActive,
      multiFactorAuthentication: securityUser?.multiFactorAuthentication,
      currentEmployee: securityUser?.currentEmployee
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [securityUser]
  );
  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    trigger,
  } = methods;

  useEffect(() => {
    if (securityUser) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [securityUser]);

  const handleNameChange = (e) => {
    setName(e);
    setValue('name', e || '');
    trigger('name');
  };

  const onSubmit = async (data) => {
    data.customer = customerVal?._id || null;
    data.contact = contactVal?._id || null;
    if (phone && phone.length > 4) {
      data.phone = phone;
    } else {
      data.phone = '';
    }
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (customersArr.length > 0) {
      const selectedCustomerIDs = customersArr.map((customer) => customer._id);
      data.customers = selectedCustomerIDs;
    }else{
      data.customers = [];
    }
    if(machinesArr.length > 0){
      const selectedMachineIDs = machinesArr.map((machine) => machine._id);
      data.machines = selectedMachineIDs;
    }else{
      data.machines = [];
    }
    // submitSecurityUserRoles.push(role?._id,role.name)
    const submitSecurityUserRoles = data.roles.filter((role) =>
      ROLES.some((Role) => Role.value === role)
    );
    if(selectedRegions.length > 0){
      const selectedRegionsIDs = selectedRegions.map((region) => region._id);
      data.selectedRegions = selectedRegionsIDs;
    }else{
      data.selectedRegions = [];
    }

    data.roles = submitSecurityUserRoles;
    try {
      dispatch(updateSecurityUser(data, securityUser._id));
      navigate(PATH_SECURITY.users.view(securityUser._id));
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      console.log('Error:', error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SECURITY.users.view(securityUser._id));
  };

  const handleInputEmail = (e) => {
    const trimmedEmail = e.target.value.trim();
    // trimmedEmail.match(emailRegEx) ? setValid(true) : setValid(false);
    setEmail(trimmedEmail);
  };



  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>

        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <Autocomplete
                // freeSolo
                required
                disabled
                value={customerVal || null}
                options={allCustomers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setCustomerVal(newValue);
                    setContactVal('');
                    dispatch(resetContacts());
                  } else {
                    setCustomerVal('');
                    setContactVal('');
                    handleNameChange('');
                    setPhone('');
                    setEmail('');
                    dispatch(resetContacts());
                  }
                }}
                id="controllable-states-demo"
                // renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
                renderInput={(params) => <TextField {...params} label="Customer" required />}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option._id}>
                    <span>{option.name}</span>
                  </div>
                )}
              </Autocomplete>
              <Autocomplete
                // freeSolo
                value={contactVal || null}
                options={activeContacts}
                getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setContactVal(newValue);
                    handleNameChange(`${newValue.firstName} ${newValue.lastName}`);
                    setPhone(newValue.phone);
                    setEmail(newValue.email);
                  } else {
                    setContactVal('');
                    handleNameChange('');
                    setPhone('');
                    setEmail('');
                  }
                }}
                id="controllable-states-demo"
                // renderOption={(props, option) => (<li  {...props} key={option.id}>{option.firstName} {option.lastName}</li>)}
                renderInput={(params) => <TextField {...params} label="Contact" />}
                ChipProps={{ size: 'small' }}
              />
              {/* {(option) => (
                  <div key={option._id}>
                    <span>{`${option.firstName} ${option.lastName}`}</span>
                  </div>
                )}
              </Autocomplete> */}
              <RHFTextField
                name="name"
                label="Full Name*"
                onChange={(e) => handleNameChange(e.target.value)}
                value={name}
              />
              <MuiTelInput
                value={phone}
                name="phone"
                label="Phone Number"
                flagSize="medium"
                defaultCountry="NZ"
                onChange={(newValue)=>setPhone(newValue)}
                inputProps={{maxLength:13}}
                forceCallingCode
              />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField
                name="email"
                type="email"
                label="Email Address"
                sx={{ my: 3 }}
                onChange={handleInputEmail}
                value={email}
                required
              />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="loginEmail" label="Login Email" disabled />
              <RHFMultiSelect
                disabled={roleTypesDisabled}
                chip
                checkbox
                name="roles"
                label="Roles"
                options={sortedRoles}
              />
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >

              <Autocomplete
                // freeSolo
                sx={{ mt: 3 }}
                multiple
                disableCloseOnSelect
                required
                value={selectedRegions || null}
                options={activeRegions}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(event, newValue) => {
                  if (newValue) {                    
                    setSelectedRegions(newValue);
                  } else {
                    setSelectedRegions('');
                  }
                }}                
                id="controllable-states-demo"
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} name="regions" label="Regions"/>
                )}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option._id}>
                    <span>{option.name}</span>
                  </div>
                )}
              </Autocomplete>

              <Autocomplete
                // freeSolo
                multiple
                disableCloseOnSelect
                required
                value={customersArr || null}
                options={allCustomers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(event, newValue) => {
                  if (newValue) {                    
                    setCustomerArr(newValue);
                  } else {
                    setCustomerArr('');
                  }
                }}                
                id="controllable-states-demo"
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} name="customers" label="Customers"/>
                )}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option._id}>
                    <span>{option.name}</span>
                  </div>
                )}
              </Autocomplete>

              <Autocomplete
                // freeSolo
                multiple
                disableCloseOnSelect
                required
                value={machinesArr || null}
                options={allMachines}
                getOptionLabel={(option) => `${option.serialNo} ${option.name ? '-' : ''} ${option.name ? option.name : ''}`}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(event, newValue) => {
                  if (newValue) {
                    setMachineArr(newValue);
                  } else {
                    setMachineArr([]);
                  }
                }}
                id="machine"
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {`${option.serialNo ? option.serialNo : ''} ${option.name ? '-' : ''} ${option.name ? option.name : ''}`}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} name="machines" label="Machines" />
                )}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option._id}>
                    <span>{option.name}</span>
                  </div>
                )}
              </Autocomplete>

            </Box>
            <Grid item md={12} display="flex">
              <RHFSwitch name="isActive" labelPlacement="start" label={<Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } />
              <RHFSwitch
                name="multiFactorAuthentication"
                labelPlacement="start"
                label={
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mx: 0,
                      width: 1,
                      justifyContent: 'space-between',
                      mb: 0.5,
                      color: 'text.secondary',
                    }}
                  >
                    {' '}
                    Multi-Factor Authentication
                  </Typography>
                }
              />

              <RHFSwitch
                name="currentEmployee"
                labelPlacement="start"
                label={
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mx: 0,
                      width: 1,
                      justifyContent: 'space-between',
                      mb: 0.5,
                      color: 'text.secondary',
                    }}
                  >
                    {' '}
                    Current Employee
                  </Typography>
                }
              />

            </Grid>

            <Stack sx={{ mt: 3 }}>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
