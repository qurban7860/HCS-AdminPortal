import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import { Box, Card, Grid, Stack,  Typography, IconButton, InputAdornment ,Autocomplete ,TextField} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// component
import Iconify from '../../components/iconify';
// routes
import { PATH_DASHBOARD, PATH_SECURITY } from '../../routes/paths';
// assets
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFSwitch, RHFTextField, RHFMultiSelect, } from '../../components/hook-form';
// slice
import { addSecurityUser } from '../../redux/slices/securityUser/securityUser';
import { getCustomers } from '../../redux/slices/customer/customer';
import { getContacts, getActiveContacts, resetContacts } from '../../redux/slices/customer/contact';
import { getRoles } from '../../redux/slices/securityUser/role';
// current user
import { useAuthContext } from '../../auth/useAuthContext';
import AddFormButtons from '../components/AddFormButtons';
// ----------------------------------------------------------------------

SecurityUserAddForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function SecurityUserAddForm({ isEdit = false, currentUser }) {
  const userRolesString = localStorage.getItem('userRoles');
  // const userRoles = JSON.parse(userRolesString);

  const [userRoles, setUserRoles] = useState(JSON.parse(userRolesString));

  const regEx = /^[^2]*$/
  const [ showPassword, setShowPassword] = useState(false);
  const [ name, setName] = useState("");
  const [ email, setEmail] = useState("");
  const { customers } = useSelector((state) => state.customer);
  const [ customerVal, setCustomerVal] = useState("");
  const { contacts, activeContacts } = useSelector((state) => state.contact);
  const [ contactVal, setContactVal] = useState("");
  const { roles } = useSelector((state) => state.role);
  const [sortedRoles, setSortedRoles] = useState([]);
  const [ phone, setPhone] = useState('');
  const [ roleTypesDisabled, setDisableRoleTypes] = useState(false);

  const ROLES = [];
  roles.map((role)=>(ROLES.push({value: role?._id, label: role.name})))

  const [roleVal, setRoleVal] = useState("");
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

  useEffect(() => {
      dispatch(getCustomers());
      dispatch(getRoles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if(customerVal){
      dispatch(getActiveContacts(customerVal._id));
    }
    if(userRoles){
      if (userRoles.some(role => role?.roleType === 'SuperAdmin')) {
        setDisableRoleTypes(false);
      } else {
        setDisableRoleTypes(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customerVal, 
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
    name: Yup.string().required("Name is required!").max(40, "Name must not exceed 40 characters!"),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required').min(6),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    roles: Yup.array().required('Roles are required'),
    isActive: Yup.boolean()
  });

  const defaultValues = useMemo(
    () => ({
      name:  name || '',
      email:  email || '',
      password:  '',
      passwordConfirmation:  '',
      isActive: true,
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
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    trigger
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
    matchIsValidTel(newValue)
    if(newValue.length < 20){
      setPhone(newValue)
    }
  }

  const handleNameChange = (event) => {
    setName(event);
    setValue("name", event || "");
    trigger("name");
  };

  const onSubmit = async (data) => {
    if(phone && phone.length > 4){
      data.phone = phone ;
    }
    if(customerVal){
      data.customer = customerVal._id;
    }
    if(contactVal){
      data.contact = contactVal._id;
    }
    if(name){
      data.name = name ;
    }
    if(email){
      data.email = email ;
    }
    if(roleVal){
      const roleId = []
      roleVal.map((role)=>(roleId.push(role?._id)))
      data.roles = roleId;
    }

    try {
      const response = await dispatch(addSecurityUser(data));
      await dispatch(resetContacts());
      reset();
      navigate(PATH_SECURITY.users.view(response.data.user._id));   
    } catch (error) {
      if(error.Message){
        enqueueSnackbar(error.Message,{ variant: `error` })
      }else if(error.message){
        enqueueSnackbar(error.message,{ variant: `error` })
      }else{
        enqueueSnackbar("Something went wrong!",{ variant: `error` })
      }
      console.log("Error:", error);
    }
  };

  const toggleCancel = ()=>{
    navigate(PATH_SECURITY.users.list);
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        {/* <Grid item xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status === 'active' ? 'success' : 'error'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

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

            {isEdit && (
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
                          field.onChange(event.target.checked ? 'banned' : 'active')
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
            )}

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
                value={customerVal || null}
                options={customers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                onChange={(event, newValue) => {
                  if(newValue){
                  dispatch(resetContacts());
                  setCustomerVal(newValue);
                  setContactVal("");
                  }
                  else{ 
                  setCustomerVal("");
                  dispatch(resetContacts());
                  setContactVal("");
                  handleNameChange("");
                  setPhone("")
                  setEmail("");
                  }
                }}
                id="controllable-states-demo"
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
                renderInput={(params) => <TextField {...params} name='customer' label="Customer" required/>}
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
                value={ contactVal || null}
                options={activeContacts}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setContactVal(newValue);
                  handleNameChange(`${newValue.firstName} ${newValue.lastName}`);
                  setPhone(newValue.phone)
                  setEmail(newValue.email);
                  }
                  else{ 
                  setContactVal("");
                  handleNameChange("");
                  setPhone("")
                  setEmail("");
                  }
                }}
                id="controllable-states-demo"
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.firstName} {option.lastName}</li>)}
                renderInput={(params) => <TextField {...params} name='contact' label="Contact" />}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option._id}>
                    <span>{`${option.firstName} ${option.lastName}`}</span>
                  </div>
                )}
              </Autocomplete>

              <RHFTextField name="name" label="Full Name*" onChange={(e) => handleNameChange(e.target.value)} value={name}/>
              {/* <RHFTextField name="phone" label="Phone" /> */}
              <MuiTelInput value={phone} name='phone' label="Phone Number" flagSize="medium" defaultCountry="NZ" onChange={handlePhoneChange} forceCallingCode/>

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
              <RHFTextField name="email" type="email" label="Login/Email Address" sx={{my:3}} onChange={(e) => setEmail(e.target.value)} value={email} required/>
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
            <Grid item md={12}>
            <RHFSwitch name="isActive" labelPlacement="start" 
            label={
              <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> 
            } 
      />
            </Grid>
            <Stack  sx={{ mt: 3 }}>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
