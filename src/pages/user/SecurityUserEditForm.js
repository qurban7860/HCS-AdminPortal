import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'
import { Box, Card, Grid, Stack, Typography, Autocomplete,TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect
} from '../../components/hook-form';
// slice
import { updateSecurityUser, setSecurityUserEditFormVisibility } from '../../redux/slices/securityUser/securityUser';
import { getCustomers } from '../../redux/slices/customer/customer';
import { getContacts , resetContacts} from '../../redux/slices/customer/contact';
import { getRoles } from '../../redux/slices/securityUser/role';
// current user
import AddFormButtons from '../components/AddFormButtons';
import { dispatchReq, dispatchReqAddAndView, dispatchReqNavToList, dispatchReqNoMsg } from '../asset/dispatchRequests';


// ----------------------------------------------------------------------



export default function SecurityUserEditForm() {
  const regEx = /^[2][0-9][0-9]$/
  const { roles } = useSelector((state) => state.role);
  const { error, securityUser } = useSelector((state) => state.user);
  const ROLES = [];
  const securityUserRoles = [];
roles.map((role)=>(ROLES.push({value: role?._id, label: role.name})))
if(securityUser?.roles){
  securityUser?.roles.map((role)=>(securityUserRoles.push(role?._id,role.name)))
}
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const { customers } = useSelector((state) => state.customer);
  const [ customerVal, setCustomerVal ] = useState('');
  const { contacts } = useSelector((state) => state.contact);
  const [ contactVal, setContactVal ] = useState('');
  const [ valid, setValid ] = useState(true);
  const [phone, setPhone] = useState('')
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const styles = { notchedOutline: { borderColor: valid ? '' : 'red' }}

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

  useLayoutEffect(()=>{
    if(securityUser.customer !== undefined && securityUser.customer !== null){
      setCustomerVal(securityUser?.customer);
    }
    if(securityUser.contact !== undefined && securityUser.contact !== null){
      setContactVal(securityUser?.contact);
    }
    if(securityUser.phone !== undefined && securityUser.phone !== null){
      setPhone(securityUser?.phone);
    }
    if(securityUser.name !== undefined && securityUser.name !== null){
      setName(securityUser?.name);
    }
    if(securityUser.email !== undefined && securityUser.email !== null){
      setEmail(securityUser?.email);
    }
  },[securityUser])
  const NewUserSchema = Yup.object().shape({
    // name: Yup.string().required('First name is required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address').trim(),
    password: Yup.string().min(6),
    passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    roles: Yup.array().required('Role is required').nullable(),
    isActive: Yup.boolean(),
  });

  const userLogin = Yup.object({
    email: Yup.string().email("Enter valid Email").required("This field is Required")
  });

  const defaultValues = useMemo(
    () => ({
      id: securityUser?._id || '',
      name: name || '',
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
  } = methods;

  useEffect(() => {
    if (securityUser) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [securityUser]);

  const handlePhoneChange = (newValue) => {
    matchIsValidTel(newValue)
    if(newValue.length < 20){
      setPhone(newValue)
    }
  }

  const onSubmit = async (data) => {
    console.log("data : " , data)
      data.customer = customerVal?._id || null
      data.contact = contactVal?._id || null
      if(phone && phone.length > 7 ){
        data.phone = phone
      }else{
        data.phone = ""
      }
      if(name){
        data.name = name ;
      }
      if(email){
        data.email = email ;
      }
      // submitSecurityUserRoles.push(role?._id,role.name)
      const submitSecurityUserRoles = data.roles.filter((role) =>
      ROLES.some((Role) => Role.value === role)
      )
      data.roles = submitSecurityUserRoles;
      dispatchReq(dispatch, updateSecurityUser(data,securityUser._id), enqueueSnackbar)
            navigate(PATH_DASHBOARD.user.view(defaultValues.id));
    //     dispatch(updateSecurityUser(data,securityUser._id))
    //     .then(res => {
    //     console.log("res : " , res)
    //     if(regEx.test(res.status)){
    //       reset();
    //       enqueueSnackbar(res.statusText)
    //       dispatch(setSecurityUserEditFormVisibility(false))
    //     }else{
    //       enqueueSnackbar(res.statusText,{ variant: `error` })
    //     }
    //   }).catch(err => {
    //     if(err.Message){
    //       enqueueSnackbar(err.Message,{ variant: `error` })
    //     }else if(err.message){
    //       enqueueSnackbar(err.message,{ variant: `error` })
    //     }else{
    //       enqueueSnackbar("Something went wrong!",{ variant: `error` })
    //     }
    // });
  };

  const toggleCancel = ()=>{
      navigate(PATH_DASHBOARD.user.view(defaultValues.id));
  }
  const handleInputEmail = (e) => {
    const emailRegEx =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      const trimmedEmail = e.target.value.trim();
      // trimmedEmail.match(emailRegEx) ? setValid(true) : setValid(false);
    console.log(trimmedEmail)
    setEmail(trimmedEmail);
  }

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
                  setName("");
                  setPhone("")
                  setEmail("");
                  dispatch(resetContacts());
                  }
                }}
                id="controllable-states-demo"
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.name}</li>)}
                renderInput={(params) => <TextField {...params} label="Customer" required disabled/>}
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
                options={contacts}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => `${option?.firstName || ""} ${option?.lastName || ""}`}
                onChange={(event, newValue) => {
                  if(newValue){
                  setContactVal(newValue);
                  setName(`${newValue.firstName} ${newValue.lastName}`);
                  setPhone(newValue.phone)
                  setEmail(newValue.email);
                  }
                  else{
                  setContactVal("");
                  setName("");
                  setPhone("")
                  setEmail("");
                  }
                }}
                id="controllable-states-demo"
                renderOption={(props, option) => (<li  {...props} key={option.id}>{option.firstName} {option.lastName}</li>)}
                renderInput={(params) => <TextField {...params} label="Contact"/>}
                ChipProps={{ size: 'small' }}
              >
                {(option) => (
                  <div key={option._id}>
                    <span>{`${option.firstName} ${option.lastName}`}</span>
                  </div>
                )}
              </Autocomplete>
              <RHFTextField name="name" label="Full Name" onChange={(e) => setName(e.target.value)} value={name} required/>
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
              <RHFTextField name="email" type="email" label="Email Address"  sx={{my:3 }} onChange={handleInputEmail} value={email} required/>
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
              <RHFTextField name="loginEmail" label="Login Email"  disabled/>
            <RHFMultiSelect
                chip
                checkbox
                name="roles"
                label="Roles"
                options={ROLES}
              />
            </Box>
            <Grid item md={12}>
              <RHFSwitch name="isActive" labelPlacement="start" label={<Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } />
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
