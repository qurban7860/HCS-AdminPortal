import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Stack, Card, TextField, Container, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFTextField, RHFAutocomplete } from '../../components/hook-form';
import { PATH_MACHINE_LOGS } from '../../routes/paths';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { machineSchema } from '../schemas/machine'; 
import useResponsive from '../../hooks/useResponsive';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';

function AllMachineLogs() {
  const dispatch = useDispatch();
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);

  const [isDateFrom, setIsDateFrom] = useState(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [isDateTo, setIsDateTo] = useState(new Date(Date.now()).toISOString().split('T')[0]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [logType, setLogType] = useState('');
  const isMobile = useResponsive('down', 'sm');
  const navigate = useNavigate();

  const defaultValues = {
    customer: null,
    machine: null,
    logDescription: ''
  };

  const methods = useForm({
    resolver: yupResolver(machineSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit } = methods;
  const { customer } = watch();
  
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
  
  const handleLogTypeChange = (event) => {
    setLogType(event.target.value);
  };

  const onSubmit = (data) => {
    const formData = {
      ...data,
      dates: [isDateFrom, isDateTo],
      customerId: selectedCustomer ? selectedCustomer._id : null,
      logType,
    };

    navigate(PATH_MACHINE_LOGS.machineLogs.LogGraphReport, { state: { logs: formData } });
  };

  const handleCustomerChange = useCallback((newCustomer) => {
    setSelectedCustomer(newCustomer);
    setValue('customer', newCustomer);
    setValue('machine', null);
  }, [setValue]);

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
                    label="Select Customer"
                    options={activeCustomers || []}
                    getOptionLabel={(option) => option.name || ''}
                    onChange={(e, newValue) => handleCustomerChange(newValue)}
                  />
                </Box>
                <Box
                  display="grid"
                  gap={2}
                  gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }}
                >
                  <RHFAutocomplete
                    name="machine"
                    label="Select Machine"
                    options={activeCustomerMachines || []}
                    getOptionLabel={(option) => option.name || ''}
                    disabled={!customer}
                    sx={{ flex: 1, minWidth: '200px' }}
                  />
                  <RHFTextField
                    name="serialNo"
                    label="Serial No.*"
                    sx={{ flex: 1, minWidth: '200px' }}
                  />
                  <FormControl sx={{ flex: 1, minWidth: '200px' }}>
                    <InputLabel id="log-type-label">Log Type</InputLabel>
                    <Select
                      labelId="log-type-label"
                      id="log-type"
                      value={logType}
                      onChange={handleLogTypeChange}
                      label="Log Type"
                    >
                      <MenuItem value="erp-log">ERP Log</MenuItem>
                      <MenuItem value="coil-log">Coil Log</MenuItem>
                      <MenuItem value="production-log">Production Log</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
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
