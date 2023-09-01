import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  IconButton,
  InputAdornment,
  Autocomplete,
  TextField,
} from '@mui/material';
// component
import Iconify from '../../components/iconify';
// routes
import { PATH_SECURITY } from '../../routes/paths';
// assets
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFMultiSelect } from '../../components/hook-form';
// slice
import { addSecurityUser } from '../../redux/slices/securityUser/securityUser';
import { getActiveSPCustomers, getAllCustomers } from '../../redux/slices/customer/customer';
import { resetContacts, getActiveContacts } from '../../redux/slices/customer/contact';
import { getRoles } from '../../redux/slices/securityUser/role';
import { getActiveRegions } from '../../redux/slices/region/region';
import { getAllMachines } from '../../redux/slices/products/machine';

import AddFormButtons from '../components/DocumentForms/AddFormButtons';
// ----------------------------------------------------------------------

SecurityUserAddForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function SecurityUserAddForm({ isEdit = false, currentUser }) {
  const userRolesString = localStorage.getItem('userRoles');
  // const userRoles = JSON.parse(userRolesString);

  // eslint-disable-next-line
  const [userRoles, setUserRoles] = useState(JSON.parse(userRolesString));

  const { spCustomers, allCustomers } = useSelector((state) => state.customer);
  const { roles } = useSelector((state) => state.role);
  const { activeRegions } = useSelector((state) => state.region);
  const { activeContacts } = useSelector((state) => state.contact);
  const { allMachines } = useSelector((state) => state.machine);

  const [selectedRegions, setSelectedRegions] = useState([]);
  // const [filteredCustomers, setFilteredCustomers] = useState(spCustomers);
  // const [filteredMachines, setFilteredMachines] = useState(allMachines);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [customerVal, setCustomerVal] = useState('');
  const [customersArr, setCustomerArr] = useState([]);
  const [machinesArr, setMachineArr] = useState([]);
  const [contactVal, setContactVal] = useState('');
  const [sortedRoles, setSortedRoles] = useState([]);
  const [phone, setPhone] = useState('');
  const [roleTypesDisabled, setDisableRoleTypes] = useState(false);

  const ROLES = [];
  roles.map((role) => ROLES.push({ value: role?._id, label: role.name }));

  // eslint-disable-next-line
  const [roleVal, setRoleVal] = useState('');
  // roles.sort((a, b) => a > b);
  // roles.sort((a, b) =>{
  //   const nameA = a.name.toUpperCase();
  //   const nameB = b.name.toUpperCase();
  //   if (nameA < nameB) {
  //     return -1;
  //   }
  //   if (nameA > nameB) {
  //     return 1;
  //   }
  //   return 0;
  // })

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    dispatch(getAllCustomers());
    dispatch(getAllMachines());
    dispatch(getActiveRegions());
    dispatch(getActiveSPCustomers());
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

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required!').max(40, 'Name must not exceed 40 characters!'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required').min(6),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    roles: Yup.array().required('Roles are required'),
    isActive: Yup.boolean(),
    multiFactorAuthentication: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: name || '',
      email: email || '',
      password: '',
      passwordConfirmation: '',
      isActive: true,
      multiFactorAuthentication: false,
      roles: currentUser?.roles || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
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
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser]);

  const handlePhoneChange = (newValue) => {
    matchIsValidTel(newValue);
    if (newValue.length < 20) {
      setPhone(newValue);
    }
  };

  const handleNameChange = (event) => {
    setName(event);
    setValue('name', event || '');
    trigger('name');
  };

  const onSubmit = async (data) => {
    if (phone && phone.length > 4) {
      data.phone = phone;
    }
    if (customerVal) {
      data.customer = customerVal._id;
    }
    if (customersArr.length > 0) {
      const selectedCustomerIDs = customersArr.map((customer) => customer._id);
      data.customers = selectedCustomerIDs;
    }
    if(machinesArr.length > 0){
      const selectedMachineIDs = machinesArr.map((machine) => machine._id);
      data.machines = selectedMachineIDs;
    }
    if (contactVal) {
      data.contact = contactVal._id;
    }
    if (name) {
      data.name = name;
    }
    if (email) {
      data.email = email;
    }
    if (roleVal) {
      const roleId = [];
      roleVal.map((role) => roleId.push(role?._id));
      data.roles = roleId;
    }
    if(selectedRegions.length > 0){
      const selectedRegionsIDs = selectedRegions.map((region) => region._id);
      data.selectedRegions = selectedRegionsIDs;
    }
// console.log(data)
    try {
      const response = await dispatch(addSecurityUser(data));
      await dispatch(resetContacts());
      reset();
      navigate(PATH_SECURITY.users.view(response.data.user._id));
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
    navigate(PATH_SECURITY.users.list);
  };

  //  -------------------------------DO NOT REMOVE------------------------------------
  // const handleRegionsChange = async (event, selectedOptions) => {
  //   setSelectedRegions(selectedOptions);
    // setCustomerArr([]);
    // setMachineArr([]);

    // if(selectedOptions.length > 0){
    //   const selectedCountries = selectedOptions?.flatMap((region) =>
    //   region.countries?.map((country) => country.country_name));

    //   const customerResponse = await dispatch(getCustomersAgainstCountries(JSON.stringify(selectedCountries)));
    //   const machineResponse = await dispatch(getMachinesAgainstCountries(JSON.stringify(selectedCountries)));
    //   setFilteredMachines(machineResponse);
    //   setFilteredCustomers(customerResponse);
    // }else{
    //   setCustomerArr([]);
    //   setMachineArr([]);
    //   setFilteredCustomers(spCustomers);
    //   setFilteredMachines(allMachines);
    // }
  // };

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
                value={customerVal || null}
                options={spCustomers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(event, newValue) => {
                  if (newValue) {
                    dispatch(resetContacts());
                    setCustomerVal(newValue);
                    setContactVal('');
                  } else {
                    setCustomerVal('');
                    dispatch(resetContacts());
                    setContactVal('');
                    handleNameChange('');
                    setPhone('');
                    setEmail('');
                  }
                }}
                id="controllable-states-demo"
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} name="customer" label="Customer" required />
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
                value={contactVal || null}
                options={customerVal ? activeContacts : []}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
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
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.firstName} {option.lastName}
                  </li>
                )}
                renderInput={(params) => <TextField {...params} name="contact" label="Contact" />}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option._id}>
                    <span>{`${option.firstName} ${option.lastName}`}</span>
                  </div>
                )}
              </Autocomplete>

              <RHFTextField
                name="name"
                label="Full Name*"
                onChange={(e) => handleNameChange(e.target.value)}
                value={name}
              />
              {/* <RHFTextField name="phone" label="Phone" /> */}
              <MuiTelInput
                value={phone}
                name="phone"
                label="Phone Number"
                flagSize="medium"
                defaultCountry="NZ"
                onChange={handlePhoneChange}
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
                label="Login/Email Address"
                sx={{ my: 3 }}
                onChange={(e) => setEmail(e.target.value)}
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
              <RHFTextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <RHFTextField
                name="passwordConfirmation"
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

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
                  sx={{ mt: 3 }}
                  multiple
                  id="regions-autocomplete"
                  options={activeRegions.length > 0 ? activeRegions : [] }
                  value={selectedRegions}
                  onChange={(event, newValue) => {
                    if (newValue) {                    
                      setSelectedRegions(newValue);
                    } else {
                      setSelectedRegions('');
                    }
                  }}                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Regions"
                      placeholder="Select Regions"
                    />
                  )}
                />

              <Autocomplete
                // freeSolo
                multiple
                required
                value={customersArr || null}
                options={allCustomers.length > 0 ? allCustomers : [] }
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                onChange={(event, newValue) => {
                  if (newValue) {                    
                    setCustomerArr(newValue);
                  } else {
                    setCustomerArr('');
                  }
                }}                id="controllable-states-demo"
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
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
                required
                value={machinesArr || null}
                options={allMachines.length > 0 ? allMachines : [] }
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
                  <li {...props} key={option.id}>
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
              <RHFSwitch
                name="isActive"
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
                    Active
                  </Typography>
                }
              />
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
