import * as Yup from 'yup';
import {  useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// @mui
import { MuiChipsInput } from 'mui-chips-input';
import {
  Card,
  Grid,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Container,
} from '@mui/material';
// redux sclices
import { getCustomers } from '../../../redux/slices/customer/customer';
import { getSecurityUsers } from '../../../redux/slices/securityUser/securityUser';
import { getConfig, updateConfig } from '../../../redux/slices/securityUser/config';
// global
// slice
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
} from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function ConfigEditForm() {

  const dispatch = useDispatch();

  const { customers } = useSelector((state) => state.customer);
  const { securityUsers } = useSelector((state) => state.user);
  const { config } = useSelector((state) => state.userConfig);

  const { Id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [whiteIps , setWhiteIps] = useState([])
  const [blackIps , setBlackIps] = useState([])

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getSecurityUsers());
  },[dispatch])

  useEffect(() => {
    if(Id){
      dispatch(getConfig(Id))
    }
  },[dispatch, Id])

  useEffect(()=>{
    if(config){
      setWhiteIps(config?.whiteListIPs)
      setBlackIps(config?.blackListIPs)
    }
  },[config])

  const EditRoleSchema = Yup.object().shape({
    blockedUsers: Yup.array().max(100).label('Blocked Users!'),
    blockedCustomers: Yup.array().max(100).label("Blocked Customers"),
    isActive: Yup.boolean(),
  });

;

  const methods = useForm({
    resolver: yupResolver(EditRoleSchema),
    defaultValues:{
      blockedUsers: config?.blockedUsers || [], 
      blockedCustomers: config?.blockedCustomers || [], 
      isActive: true,
    }
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { blockedUsers, blockedCustomers } = watch()

  const onSubmit = async (data) => {
    try {
      const selectedUserIDs =  data?.blockedUsers?.map((user) => user?._id);
      data.BlockedUsers = selectedUserIDs
      
      const selectedCustomerIDs =  data?.blockedCustomers?.map((customer) => customer?._id);
      data.BlockedCustomers = selectedCustomerIDs

      data.whiteListIPs = whiteIps 
      data.blackListIPs = blackIps

      await dispatch(updateConfig(config?._id, data));
      // dispatch(getConfig(config?._id));
      navigate(PATH_SETTING.userConfig.view(config?._id));
      enqueueSnackbar('Configuration updated Successfully!');
      reset();
    } catch (error) {
      enqueueSnackbar('Configuration Updating failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.userConfig.view(config?._id));
  };

  const isValidIP = (ip) => {
    // Regular expression for IPv4 address pattern
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // Regular expression for IPv6 address pattern
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
  };

  const handleWhiteIpChange = (newWhiteIps) => {
    if(isValidIP(newWhiteIps[newWhiteIps.length-1])){
    const array = [...new Set(newWhiteIps)]
    if(array.length < 101){
      setWhiteIps(array);
    }
    }
  };

  const handleBlackIpChange = (newBlackIps) => {
    if(isValidIP(newBlackIps[newBlackIps.length-1])){
    const array = [...new Set(newBlackIps)]
    if(array.length < 101){
      setBlackIps(array);
    }
    }
  };

  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name='Edit Config' />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
                
                <Controller
                  name="blockedUsers"
                  control={control}
                  defaultValue={blockedUsers || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      {...field}
                      id="controllable-states-demo"
                      options={securityUsers}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                      onChange={(event, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField 
                        {...params} 
                        name="blockedUsers"
                        id="blockedUsers"
                        label="Blocked Users"  
                        error={!!error}
                        helperText={error?.message} 
                        inputRef={ref} 
                        />
                      )}
                    />
                  )}
                />

                <Controller
                  name="blockedCustomers"
                  control={control}
                  defaultValue={blockedCustomers || null}
                  render={ ({field: { ref, ...field }, fieldState: { error } }) => (
                    <Autocomplete
                      multiple
                      {...field}
                      id="controllable-states-demo"
                      options={customers}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                      )}
                      onChange={(event, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField 
                        {...params} 
                        name="blockedCustomers"
                        id="blockedCustomers"
                        label="Blocked Customers"  
                        error={!!error}
                        helperText={error?.message} 
                        inputRef={ref} 
                        />
                      )}
                    />
                  )}
                />

              <MuiChipsInput label="White List IPs" value={whiteIps} onChange={handleWhiteIpChange} />
              <MuiChipsInput label="Black List IPs" value={blackIps} onChange={handleBlackIpChange} />

              <Grid display="flex" alignItems="end">
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
              </Grid>
            </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
