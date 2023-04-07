import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, IconButton, InputAdornment ,Autocomplete ,TextField, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// component
import Iconify from '../../../components/iconify';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// assets
import { countries } from '../../../assets/data';
// components
import Label from '../../../components/label';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar, 
  RHFAutocomplete,
  RHFMultiSelect,
  RHFSelect,
} from '../../../components/hook-form';
// slice
import { saveUser, getUsers, setFormVisibility } from '../../../redux/slices/user';
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getContacts , resetContacts} from '../../../redux/slices/customer/contact';
import { getRoles } from '../../../redux/slices/securityUser/role';
// current user
import { useAuthContext } from '../../../auth/useAuthContext';
import AddFormButtons from '../../../pages/components/AddFormButtons';
// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, currentUser }) {
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [showPassword, setShowPassword] = useState(false);

  const { error } = useSelector((state) => state.user);
  const { customers } = useSelector((state) => state.customer);
  const [customerVal, setCustomerVal] = useState("");
  const { contacts } = useSelector((state) => state.contact);
  const [contactVal, setContactVal] = useState("");
  const { roles } = useSelector((state) => state.role);
  const [phone, setPhone] = useState('')

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
  const { userId } = useAuthContext();
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
      dispatch(getCustomers());
      dispatch(getRoles())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if(customerVal){
      dispatch(getContacts(customerVal._id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [dispatch,customerVal]);
 const phoneRegExp = /(?:\(?\+\d{2}\)?\s*)?\d+(?:[ -]*\d+)*$/
 
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required').min(6),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    // phone: Yup.string().matches(phoneRegExp, 'Phone number is not valid'),
    roles: Yup.array().required('Roles are required'),
    // address: Yup.string().required('Address is required'),
    // country: Yup.string().required('Country is required'),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    // role: Yup.string().required('Role is required').nullable(),
    // zipCode: Yup.string(),
    // avatarUrl: Yup.string().nullable(true),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.firstName || '',
      email: currentUser?.email || '',
      password: currentUser?.password || '',
      passwordConfirmation: currentUser?.passwordConfirmation || '',
      // phone: '',
      // address: currentUser?.address || '',
      // country: currentUser?.country || '',
      // state: currentUser?.state || '',
      // city: currentUser?.city || '',
      // zipCode: currentUser?.zipCode || '',
      // avatarUrl: currentUser?.avatarUrl || null,
      // isVerified: currentUser?.isVerified || true,
      // status: currentUser?.status,
      roles: currentUser?.roles || [],
      // addedBy: userId,
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
  } = methods;

  const values = watch();

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

  const onSubmit = async (data) => {
      try{
        if(phone){
          data.phone = phone ;
        }
        if(customerVal){
          data.customer = customerVal._id;
        }
        if(contactVal){
          data.contact = contactVal._id;
        }
        if(roleVal){
          const roleId = []
          roleVal.map((role)=>(roleId.push(role?._id)))
          data.roles = roleId;
        }
        dispatch(saveUser(data));
        reset();
        enqueueSnackbar('Create success!');
        dispatch(setFormVisibility(false));
        navigate(PATH_DASHBOARD.user.list);
      } catch(err){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const toggleCancel = ()=>{
    navigate(PATH_DASHBOARD.user.list);
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
                  setCustomerVal(newValue);
                  setContactVal("");
                  dispatch(resetContacts());
                  }
                  else{ 
                  setCustomerVal("");
                  setContactVal("");
                  dispatch(resetContacts());
                  }
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} name='customer' label="Customer" required/>}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option.id}>
                    <span>{option.name}</span>
                  </div>
                )}
              </Autocomplete>

              <Autocomplete 
                // freeSolo
                value={ contactVal || null}
                required
                options={contacts}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setContactVal(newValue);
                  }
                  else{ 
                  setContactVal("");
                  }
                }}
                // renderOption={(props, option) => (<Box component="li" {...props} key={option.id}>{`${option.firstName} ${option.lastName}`}</Box>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} name='contact' label="Contact" required/>}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option.id}>
                    <span>{`${option.firstName} ${option.lastName}`}</span>
                  </div>
                )}
              </Autocomplete>

              <RHFTextField name="name" label="Full Name" />
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
              <RHFTextField name="email" label="Email Address" sx={{my:3}}/>
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

              {/* <RHFAutocomplete
                  name="country"
                  label="Country"
                  freeSolo
                  options={countries.map((country) => country.label)}
                  ChipProps={{ size: 'small' }}
                /> */}


              {/* <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="zipCode" label="Zip/Code" /> */}
              <RHFMultiSelect
                chip
                checkbox
                name="roles"
                label="Roles"
                options={ROLES}
              />
              {/* <Autocomplete 
                // freeSolo
                multiple
                // value={roleVal}
                options={roles}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                onChange={(event, newValue) => {
                  if(newValue){
                  setRoleVal(newValue);
                  }
                  else{ 
                  setRoleVal("");
                  }
                }}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Customer" />}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option.id}>
                    <span>{option.name}</span>
                  </div>
                )}
              </Autocomplete> */}

              {/* <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                // value={ roleVal}
                options={roles}
                disableCloseOnSelect
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                  setRoleVal(newValue);
                  }
                  else{ 
                  setRoleVal([]);
                  }
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.name}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField {...params} label="Roles"  />
                )}
              /> */}
              {/* <RHFMultiSelect
                chip
                checkbox
                name="rolesTypes"
                label="Roles Types"
                options={roles}
              /> */}

              {/* <RHFSelect native name="role" label="Roles">
                <option value="" disabled/>
                {roles.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
                </RHFSelect>             */}
                {/* <RHFAutocomplete
                  name="role" 
                  label="Roles"
                  freeSolo
                  options={ROLES.map((option) => option.value)}
                  // getOptionLabel={(option) => option.title}
                  
                  ChipProps={{ size: 'small' }}
                /> */}
            </Box>
            
            <Stack  sx={{ mt: 3 }}>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
