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
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../config-global';
// slice
import { updateCustomer, setCustomerEditFormVisibility } from '../../redux/slices/customer';
import { getContacts, getSPContacts } from '../../redux/slices/contact';
import { getSites } from '../../redux/slices/site';


// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import Iconify from '../../components/iconify';

import FormProvider, {
  RHFSelect,
  RHFMultiSelect,
  RHFTextField,

} from '../../components/hook-form';


// ----------------------------------------------------------------------


export default function CustomerEditForm() {

  const { error, customer } = useSelector((state) => state.customer);

  const { users } = useSelector((state) => state.user);

  const { sites } = useSelector((state) => state.site);

  const { contacts, spContacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const EditCustomerSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required'),
    tradingName: Yup.string().min(5).max(40),
    // mainSite: Yup.string(),
    // sites: Yup.array(),
    // contacts: Yup.array(),
    // accountManager: Yup.string(),
    // projectManager: Yup.string(),
    // supportManager: Yup.string(),
    // primaryBillingContact: Yup.string(),
    // primaryTechnicalContact: Yup.string(),
  });


  const defaultValues = useMemo(
    () => ({
      id: customer?._id || '',
      name: customer?.name || '',
      tradingName: customer?.tradingName || '',
      mainSite: customer?.mainSite?._id === null || customer?.mainSite?._id === undefined  ? null : customer.mainSite._id ,
      accountManager: customer?.accountManager?._id === null || customer?.accountManager?._id === undefined  ? null : customer.accountManager?._id,
      projectManager: customer?.projectManager?._id === null || customer?.projectManager?._id === undefined  ? null : customer.projectManager?._id, 
      supportManager: customer?.supportManager?._id === null || customer?.supportManager?._id === undefined  ? null : customer.supportManager?._id,
      primaryBillingContact: customer?.primaryBillingContact?._id  === null || customer?.primaryBillingContact?._id  === undefined  ? null : customer.primaryBillingContact?._id ,
      primaryTechnicalContact: customer?.primaryTechnicalContact?._id === null || customer?.primaryTechnicalContact?._id === undefined  ? null : customer.primaryTechnicalContact._id, 
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer]
  );
// customer. === null || customer. === undefined  ? null : customer.,
  const methods = useForm({
    resolver: yupResolver(EditCustomerSchema),
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
    dispatch(getContacts(customer._id));
    dispatch(getSites(customer._id));
    // dispatch(getSPContacts());

  }, [dispatch, customer]);

  useEffect(() => {
    if (customer) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const toggleCancel = () => 
    {
      dispatch(setCustomerEditFormVisibility(false));
    };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      dispatch(updateCustomer(data));
      reset();
      enqueueSnackbar('Update success!');
      navigate(PATH_DASHBOARD.customer.view(customer._id));
    } catch (err) {
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

                <RHFSelect native name="mainSite" label="Main Site">
                  <option defaultValue value="null" selected >No Main Site Selected</option>
                  {
                    sites.length > 0 && sites.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.name}
                      </option>
                    ))}
                </RHFSelect>

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


              <RHFSelect native name="primaryBillingContact" label="Primary Billing Contact">
                    <option defaultValue value="null" selected >No Primary Billing Contact Selected</option>
                    { 
                    contacts.length > 0 && contacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFSelect native name="primaryTechnicalContact" label="Primary Technical Contact">
                    <option defaultValue value="null" selected >No Primary Technical Contact Selected</option>
                    { 
                    contacts.length > 0 && contacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>


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

                <RHFSelect native name="accountManager" label="Account Manager">
                  <option defaultValue value="null" selected >No Account Manager Selected</option>
                  {
                    spContacts.length > 0 && spContacts.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}
                      </option>
                    ))}
                </RHFSelect>

                <RHFSelect native name="projectManager" label="Project Manager">
                  <option defaultValue value="null" selected >No Project Manager Selected</option>
                  {
                    spContacts.length > 0 && spContacts.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}
                      </option>
                    ))}
                </RHFSelect>

                <RHFSelect native name="supportManager" label="Support Manager">
                  <option defaultValue value="null" selected >No Support Manager Selected</option>
                  {
                    spContacts.length > 0 && spContacts.map((option) => (
                      <option key={option._id} value={option._id}>
                        {option.firstName} {option.lastName}
                      </option>
                    ))}
                </RHFSelect>

              </Box>

              <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(5, 1fr)',
                }}
              > 

                <LoadingButton 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  loading={isSubmitting}>
                    Save Changes
                </LoadingButton>

                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>

            </Box>

            </Stack>

            
            
          </Card>

        </Grid>
      </Grid>
    </FormProvider>
  );
}
