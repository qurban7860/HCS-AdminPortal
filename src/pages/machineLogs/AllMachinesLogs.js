import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Stack, Card, TextField, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFAutocomplete } from '../../components/hook-form';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { getMachineLogRecords } from '../../redux/slices/products/machineErpLogs'; 
import { AddMachineLogSchema } from '../schemas/machine'; 
import useResponsive from '../../hooks/useResponsive';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { machineLogTypeFormats } from '../../constants/machineLogTypeFormats';
import MachineLogsList from '../machine/logs/MachineLogsList';

function AllMachineLogs() {
  const dispatch = useDispatch();
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { selectedLogType } = useSelector((state) => state.machineErpLogs);
  const isMobile = useResponsive('down', 'sm');
  const [logsData, setLogsData] = useState(null);

  const defaultValues = {
    customer: null,
    machine: null,
    logType: null,
    dateFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date(Date.now()).toISOString().split('T')[0],
  };
  
  const methods = useForm({
    resolver: yupResolver(AddMachineLogSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, trigger } = methods;
  const { customer, machine, logType, dateFrom, dateTo } = watch();

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
    const machineId = data.machine?._id;
    const isCreatedAt = false;
    const page = 0; 
    const rowsPerPage = 100; 
    const customerId = data.customer?._id;
  
    if (!selectedLogType) {
      console.error("Log type is not defined!");
      return;
    }
  
    if (customerId) {
      if (data.dateFrom && data.dateTo) {
        dispatch(getMachineLogRecords(machineId, page, rowsPerPage, data.dateFrom, data.dateTo, isCreatedAt, data.machine?.isArchived, selectedLogType.type, customerId));
      } else if (!data.dateFrom && !data.dateTo) {
        dispatch(getMachineLogRecords(machineId, page, rowsPerPage, null, null, isCreatedAt, data.machine?.isArchived, selectedLogType.type, customerId));
      }
    }
  
    setLogsData(data); 
  };
  
  const handleCustomerChange = useCallback((newCustomer) => {
    setValue('customer', newCustomer);
    setValue('machine', null); 
    trigger(['customer', 'machine']); 
  }, [setValue, trigger]);

  const handleMachineChange = useCallback((newMachine) => {
    setValue('machine', newMachine);
    trigger('machine'); 
  }, [setValue, trigger]);

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="Machine Logs" />
        </StyledCardContainer>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                  >
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
                      size="small"
                    />
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
                      size="small"
                    />
                  </Box>
                  <Box
                    display="grid"
                    gap={2}
                    gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }}
                  >
                    <TextField
                      {...methods.register('dateFrom')}
                      type="date"
                      label="Start Date"
                      sx={{ width: '100%' }}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      error={dateFrom && dateTo && dateFrom > dateTo}
                      helperText={
                        dateFrom && dateTo && dateFrom > dateTo
                          ? 'Start Date should be before End Date'
                          : ''
                      }
                    />
                    <TextField
                      {...methods.register('dateTo')}
                      type="date"
                      label="End Date"
                      sx={{ width: '100%' }}
                      InputLabelProps={{ shrink: true }}
                      size="small"
                      error={dateFrom && dateTo && dateFrom > dateTo}
                      helperText={
                        dateFrom && dateTo && dateFrom > dateTo
                          ? 'End Date should be after Start Date'
                          : ''
                      }
                    />
                    <RHFAutocomplete
                      label="Select Log Type*"
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
                      disableClearable
                      filterOptions={(options) => options}
                      autoSelect
                      openOnFocus
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
      {logsData && <MachineLogsList logsData={logsData} />}
    </>
  );
}

export default AllMachineLogs;
