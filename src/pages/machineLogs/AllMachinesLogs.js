import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Stack, Card, TextField, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField, RHFAutocomplete } from '../../components/hook-form';
import { PATH_MACHINE_LOGS } from '../../routes/paths';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { AddMachineLogSchema } from '../schemas/machine'; 
import useResponsive from '../../hooks/useResponsive';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { machineLogTypeFormats } from '../../constants/machineLogTypeFormats';

function AllMachineLogs() {
  const dispatch = useDispatch();
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);
  const [isDateFrom, setIsDateFrom] = useState(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [isDateTo, setIsDateTo] = useState(new Date(Date.now()).toISOString().split('T')[0]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const isMobile = useResponsive('down', 'sm');
  const navigate = useNavigate();

  const defaultValues = {
    customer: null,
    machine: null,
    serialNo: '',
  };

  const methods = useForm({
    resolver: yupResolver(AddMachineLogSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, trigger } = methods;
  const { customer, machine } = watch();

  const onChangeStartDate = (e) => setIsDateFrom(e.target.value);
  const onChangeEndDate = (e) => setIsDateTo(e.target.value);

  useEffect(() => {
    dispatch(getActiveCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (customer) {
      dispatch(getActiveCustomerMachines(customer._id));
    } else {
      dispatch(resetActiveCustomerMachines());
    }
  }, [dispatch, customer]);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      dates: [isDateFrom, isDateTo],
      customerId: selectedCustomer ? selectedCustomer._id : null,
    };

    navigate(PATH_MACHINE_LOGS.machineLogs.LogGraphReport, { state: { logs: formData } });
  };
  
  const handleCustomerChange = useCallback((newCustomer) => {
    setSelectedCustomer(newCustomer);
    setValue('customer', newCustomer);
    setValue('machine', null); 
    setValue('serialNo')
    trigger(['customer', 'machine']);
  }, [setValue, trigger]);

  const handleMachineChange = useCallback((newMachine) => {
    setValue('machine', newMachine);
    setValue('serialNo', newMachine ? newMachine.serialNo : ''); 
    trigger('serialNo');
  }, [setValue, trigger]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Machine Logs" coilLog erpLog productionLog />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box display="flex" flexDirection="column" width="100%">
                  <RHFAutocomplete
                    name="customer"
                    label="Select Customer*"
                    options={activeCustomers || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option?.name || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>
                        {option?.name || ''}
                      </li>
                    )}
                    onChange={(e, newValue) => handleCustomerChange(newValue)}
                  />
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  <RHFAutocomplete
                    name="machine"
                    label="Select Machine"
                    options={activeCustomerMachines || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) =>
                      `${option.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`
                    }
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.serialNo || ''} ${
                        option?.name ? '-' : ''
                      } ${option?.name || ''}`}</li>
                    )}
                    onChange={(e, newValue) => handleMachineChange(newValue)}
                  />
                  <RHFTextField name="serialNo" label="Serial No." />
                </Box>
                <Box
                  display="grid"
                  gap={2}
                  gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }}
                >
                  <TextField
                    value={isDateFrom}
                    type="date"
                    label="Start Date"
                    sx={{ width: '100%' }}
                    onChange={onChangeStartDate}
                    error={isDateFrom && isDateTo && isDateFrom > isDateTo}
                    helperText={
                      isDateFrom && isDateTo && isDateFrom > isDateTo
                        ? 'Start Date should be before End Date'
                        : ''
                    }
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <TextField
                    value={isDateTo}
                    type="date"
                    label="End Date"
                    sx={{ width: '100%' }}
                    onChange={onChangeEndDate}
                    error={isDateFrom && isDateTo && isDateFrom > isDateTo}
                    helperText={
                      isDateFrom && isDateTo && isDateFrom > isDateTo
                        ? 'End Date should be after Start Date'
                        : ''
                    }
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                  <RHFAutocomplete
                    label="Select Log Type"
                    name="logType"
                    options={machineLogTypeFormats}
                    size="small"
                    getOptionLabel={(option) => option.type}
                    isOptionEqualToValue={(option, value) => option?.type === value?.type}
                    renderOption={(props, option) => (
                      <li {...props} key={option?.type}>
                        {option.type || ''}
                      </li>
                    )}
                    getOptionDisabled={(option) => option?.disabled}
                  />
                </Box>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  size={isMobile ? 'medium' : 'large'}
                >
                  Get Log
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

export default AllMachineLogs;
