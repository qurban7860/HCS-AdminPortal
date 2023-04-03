import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, IconButton, InputAdornment ,Autocomplete ,TextField } from '@mui/material';
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
  RHFSelect,
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar, 
  RHFAutocomplete,
} from '../../../components/hook-form';
// slice
import { saveUser, getUsers, setFormVisibility } from '../../../redux/slices/user';
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getContacts , resetContacts} from '../../../redux/slices/customer/contact';
// current user
import { useAuthContext } from '../../../auth/useAuthContext';
import AddFormButtons from '../../../pages/components/AddFormButtons';
// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

const ROLES = [
  { id: '1', value: 'Administrator' },
  { id: '2', value: 'Normal User' },
  { id: '3', value: 'Guest User' },
  { id: '4', value: 'Restriced User' },
];

export default function UserNewEditForm({ isEdit = false, currentUser }) {

  const [showPassword, setShowPassword] = useState(false);
  const [customerVal, setCustomerVal] = useState('');
  const [contactVal, setContactVal] = useState('');
  const [roleVal, setRoleVal] = useState('');

  const { error } = useSelector((state) => state.user);
  const { customers } = useSelector((state) => state.customer);
  const { contacts } = useSelector((state) => state.contact);
  const { userId } = useAuthContext();
  
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
      dispatch(getCustomers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if(customerVal){
      dispatch(getContacts(customerVal._id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [dispatch,customerVal]);

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('First name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required').min(6),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    phoneNumber: Yup.number().required('Phone number is required'),
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
      phoneNumber: currentUser?.phoneNumber || '',
      // address: currentUser?.address || '',
      // country: currentUser?.country || '',
      // state: currentUser?.state || '',
      // city: currentUser?.city || '',
      // zipCode: currentUser?.zipCode || '',
      // avatarUrl: currentUser?.avatarUrl || null,
      // isVerified: currentUser?.isVerified || true,
      // status: currentUser?.status,
      // role: currentUser?.role || '',
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

  
  const onSubmit = async (data) => {
      try{
        if(customerVal){
          data.customer = customerVal._id;
        }
        if(contactVal){
          data.contact = contactVal._id;
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
                value={customerVal || null}
                options={customers}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  if(newValue){
                  setCustomerVal(newValue);
                  }
                  else{ 
                  setCustomerVal("");
                  setContactVal("");
                  dispatch(resetContacts());
                  }
                }}
                // renderOption={(props, option) => (<Box component="li" {...props} key={option.id}>{option.name}</Box>)}
                id="controllable-states-demo"
                renderInput={(params) => <TextField {...params} label="Customer" />}
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
                options={contacts}
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
                renderInput={(params) => <TextField {...params} label="Contact" />}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option.id}>
                    <span>{`${option.firstName} ${option.lastName}`}</span>
                  </div>
                )}
              </Autocomplete>

              <RHFTextField name="name" label="Full Name" />
              <RHFTextField name="phoneNumber" label="Phone Number" />

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

              {/* <RHFSelect native name="country" label="Country" placeholder="Country">
                <option value="" />
                {countries.map((country) => (
                  <option key={country.code} value={country.label}>
                    {country.label}
                  </option>
                ))}
              </RHFSelect> */}
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
              {/* <RHFSelect native name="role" label="Roles">
                <option value="" disabled/>
                {ROLES.map((option) => (
                    <option key={option.id} value={option.value}>
                      {option.value}
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
