import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getUsers } from '../../redux/slices/user';
import { getSites } from '../../redux/slices/site';
import { getContacts } from '../../redux/slices/contact';
import { saveCustomer } from '../../redux/slices/customer';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';

import { useAuthContext } from '../../auth/useAuthContext';

import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFTextField,
  RHFSwitch
} from '../../components/hook-form';

// ----------------------------------------------------------------------

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {

  const { customer } = useSelector((state) => state.customer);

  const { users } = useSelector((state) => state.user);

  const { sites } = useSelector((state) => state.site);

  const { contacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddCustomerSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required')  ,
    tradingName: Yup.string().min(5).max(40).required('Trading Name is required')  ,
    mainSite: Yup.string(),
    sites: Yup.array(),
    contacts: Yup.array(),
    accountManager: Yup.string(),
    projectManager: Yup.string(),
    supportManager: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      name: '',
      mainSite: '',
      sites: [],
      contacts: [],
      tradingName: '',
      accountManager: '',
      projectManager: '',
      supportManager: '',
      isArchived: true
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCustomer]
  );

  const methods = useForm({
    resolver: yupResolver(AddCustomerSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useLayoutEffect(() => {
    dispatch(getUsers());
    // dispatch(getSites());
    // dispatch(getContacts());

  }, [dispatch]);

  useEffect(() => {
      // reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  const onSubmit = async (data) => {
    console.log(data);
      try{
        dispatch(saveCustomer(data));
        reset();
        enqueueSnackbar('Create success!');
        // navigate(PATH_DASHBOARD.customer.list);
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Customer Name" />

              <RHFTextField name="tradingName" label="Trading Name" />

              {/* <RHFSelect native name="mainSite" label="Main Site">
                    <option value="" selected/>
                    { 
                    sites.length > 0 && sites.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>

              <RHFMultiSelect
                  customObject
                  customName="name"
                  chip
                  checkbox
                  name="sites"
                  label="Sites"
                  options={sites}
                />

              <RHFMultiSelect
                  customObject
                  customName="firstName"
                  chip
                  checkbox
                  name="contacts"
                  label="Contacts"
                  options={contacts}
                /> */}

              <RHFSelect native name="accountManager" label="Account Manager">
                    <option value="" selected/>
                    { 
                    users.length > 0 && users.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="projectManager" label="Project Manager">
                    <option value="" selected/>
                    { 
                    users.length > 0 && users.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="supportManager" label="Support Manager">
                    <option value="" selected/>
                    { 
                    users.length > 0 && users.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              {/* <RHFSwitch
              name="isArchived"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    isArchived
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            /> */}
              </Box>

              </Stack>

              <Stack alignItems="flex-start" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Customer
            </LoadingButton>
            </Stack>
                        
            </Card>
          
          </Grid>
        </Grid>
    </FormProvider>
  );
}
