import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import { Box, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// routes
import { PATH_DASHBOARD, PATH_SECURITY } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFMultiSelect } from '../../components/hook-form';
// slice
import {
  updateSecurityUser,
  setSecurityUserEditFormVisibility,
} from '../../redux/slices/securityUser/securityUser';
import { getActiveSPCustomers, getActiveCustomers } from '../../redux/slices/customer/customer';
import { getActiveContacts, resetContacts } from '../../redux/slices/customer/contact';
import { getActiveMachines } from '../../redux/slices/products/machine';
import { getRoles } from '../../redux/slices/securityUser/role';
import { getActiveRegions } from '../../redux/slices/region/region';
// current user
import AddFormButtons from '../components/DocumentForms/AddFormButtons';

// ----------------------------------------------------------------------

export default function SecurityUserEditForm() {
  const userRolesString = localStorage.getItem('userRoles');
  const ROLES = [];
  // const userRoles = JSON.parse(userRolesString);
  const [userRoles, setUserRoles] = useState(JSON.parse(userRolesString));
  const regEx = /^[2][0-9][0-9]$/;
  const { roles } = useSelector((state) => state.role);
  const { securityUser } = useSelector((state) => state.user);
  const { activeRegions } = useSelector((state) => state.region);
  const { activeMachines, customerMachines } = useSelector((state) => state.machine)
  const { spCustomers, activeCustomers } = useSelector((state) => state.customer);
 
  const securityUserRoles = [];
  roles.map((role) => ROLES.push({ value: role?._id, label: role.name }));
  if (securityUser?.roles) {
    securityUser?.roles.map((role) => securityUserRoles.push(role?._id, role.name));
  }
  
  const [roleTypesDisabled, setDisableRoleTypes] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState(spCustomers);
  const [filteredMachines, setFilteredMachines] = useState(activeMachines);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [customerVal, setCustomerVal] = useState('');
  const [customersArr, setCustomerArr] = useState([]);
  const [machinesArr, setMachineArr] = useState([]);
  const { contacts, activeContacts } = useSelector((state) => state.contact);
  const [contactVal, setContactVal] = useState('');
  const [valid, setValid] = useState(true);
  const [phone, setPhone] = useState('');
  const [sortedRoles, setSortedRoles] = useState([]);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  

  const styles = { notchedOutline: { borderColor: valid ? '' : 'red' } };

  useLayoutEffect(() => {
    dispatch(getActiveSPCustomers());
    dispatch(getActiveCustomers());
    dispatch(getActiveRegions());
    dispatch(getActiveMachines());
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

  useLayoutEffect(() => {
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
  useLayoutEffect(() => {
    if (securityUser.regions !== undefined && securityUser.regions !== null) {
      setSelectedRegions(securityUser?.regions);
    }
    if (securityUser.customer !== undefined && securityUser.customer !== null) {
      setCustomerVal(securityUser?.customer);
    }
    if (securityUser.contact !== undefined && securityUser.contact !== null) {
      setContactVal(securityUser?.contact);
    }
    if (securityUser.phone !== undefined && securityUser.phone !== null) {
      setPhone(securityUser?.phone);
    }
    if (securityUser.name !== undefined && securityUser.name !== null) {
      handleNameChange(securityUser?.name);
    }
    if (securityUser.email !== undefined && securityUser.email !== null) {
      setEmail(securityUser?.email);
    }
    if (securityUser.customers !== undefined && securityUser.customers.length > 0) {
      setCustomerArr(securityUser?.customers);
    }
    if (securityUser.machines !== undefined && securityUser.machines.length > 0) {
      setMachineArr(securityUser?.machines);

    }if (securityUser.regions !== undefined && securityUser.regions.length > 0) {
      setSelectedRegions(securityUser?.regions);
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
  });

  const userLogin = Yup.object({
    email: Yup.string().email('Enter valid Email').required('This field is Required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: securityUser?._id || '',
      name: securityUser?.name || '',
      email: email || '',
      roles: securityUserRoles || [],
      loginEmail: securityUser?.login,
      isActive: securityUser?.isActive,
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
    watch,
    control,
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

  const handlePhoneChange = (newValue) => {
    matchIsValidTel(newValue);
    if (newValue.length < 20) {
      setPhone(newValue);
    }
  };

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
      await dispatch(updateSecurityUser(data, securityUser._id));
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
    const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    const trimmedEmail = e.target.value.trim();
    // trimmedEmail.match(emailRegEx) ? setValid(true) : setValid(false);
    setEmail(trimmedEmail);
  };


  //  -------------------------------DO NOT REMOVE------------------------------------
  // const handleRegionsChange = async (event, selectedOptions) => {
  //   setSelectedRegions(selectedOptions);
  //   setCustomerArr([]);
  //   setMachineArr([]);

  //   if(selectedOptions.length > 0){
  //     const selectedCountries = selectedOptions?.flatMap((region) =>
  //     region.countries?.map((country) => country.country_name));

  //     const customerResponse = await dispatch(getCustomersAgainstCountries(JSON.stringify(selectedCountries)));
  //     const machineResponse = await dispatch(getMachinesAgainstCountries(JSON.stringify(selectedCountries)));
  //     setFilteredMachines(machineResponse);
  //     setFilteredCustomers(customerResponse);
  //   }else{
  //     setCustomerArr([]);
  //     setMachineArr([]);
  //     setFilteredCustomers(spCustomers);
  //     setFilteredMachines(activeMachines);
  //   }
  // };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
              <Label
                color={values.status === 'active' ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active'}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'Banned' : 'active')
                        }
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />


            <RHFSwitch
              name="isVerified"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />
          </Card>
        </Grid> */}

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
                options={spCustomers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
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
                isOptionEqualToValue={(option, value) => option.name === value.name}
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
                  sx={{ mt: 3 }}
                  multiple
                  id="regions-autocomplete"
                  options={activeRegions}
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
                options={activeCustomers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
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
                options={activeMachines}
                getOptionLabel={(option) => `${option.serialNo} ${option.name ? '-' : ''} ${option.name ? option.name : ''}`}
                isOptionEqualToValue={(option, value) => option.serialNo === value.serialNo}
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
              >
                {(option) => (
                  <div key={option._id}>
                    <span>{option.name}</span>
                  </div>
                )}
              </Autocomplete>

            </Box>
            <Grid item md={12}>
              <RHFSwitch name="isActive" labelPlacement="start" label={<Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } />
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
