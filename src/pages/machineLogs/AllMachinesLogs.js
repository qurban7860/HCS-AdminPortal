import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Stack, Card, Container, Typography, useTheme, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import Iconify from '../../components/iconify';
import FormProvider, { RHFAutocomplete, RHFDatePicker } from '../../components/hook-form';
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
  const isMobile = useResponsive('down', 'sm');
  const [logsData, setLogsData] = useState(null);
  const theme = useTheme();

  const defaultValues = {
    customer: null,
    machine: null,
    logType: machineLogTypeFormats.find(option => option.type === 'ERP') || null,
    dateFrom: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), 
    dateTo: new Date(), 
  };
  
  const methods = useForm({
    resolver: yupResolver(AddMachineLogSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, trigger } = methods;
  const { customer, dateFrom, dateTo } = watch();

  useEffect(() => {
    dispatch(getActiveCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (customer) {
      dispatch(getActiveCustomerMachines(customer._id));
      setShowMachines(false);
    } else {
      dispatch(resetActiveCustomerMachines());
    }
  }, [dispatch, customer]);

  const onSubmit = (data) => {
    const customerId = data.customer?._id; 
    const machineId = data.machine?._id || undefined; 
    const isCreatedAt = false;
    const page = 0;
    const rowsPerPage = 100;
  
    dispatch(
      getMachineLogRecords({customerId, machineId, page, pageSize: rowsPerPage, fromDate: data.dateFrom, toDate: data.dateTo, isCreatedAt, isMachineArchived: data.machine?.isArchived, selectedLogType: data.logType?.type })
    );
    setLogsData(data);
    setShowMachines(true); 
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
  
  const handleLogTypeChange = useCallback((newLogType) => {
    setValue('logType', newLogType);
    trigger('logType'); 
  }, [setValue, trigger]);

  const [showMachines, setShowMachines] = useState(false); 

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
                  <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
                    <RHFAutocomplete
                      name="customer"
                      label="Customer*"
                      options={activeCustomers || []}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option?.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}> {option?.name || ''} </li> )}
                      onChange={(e, newValue) => handleCustomerChange(newValue)}
                      size="small"
                    />
                    <RHFAutocomplete
                      name="machine"
                      label="Machine"
                      options={activeCustomerMachines || []}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.serialNo || ''} ${ option?.name ? '-' : '' } ${option?.name || ''}`}</li> )}
                      onChange={(e, newValue) => handleMachineChange(newValue)}
                      size="small"
                    />
                  </Box>
                  <Box display="grid" gap={2} gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }}>
                    <RHFDatePicker
                      label="Start Date"
                      name="dateFrom"
                      size="small"
                      value={dateFrom}
                      onChange={(newValue) => { setValue('dateFrom', newValue); trigger('dateFrom'); trigger('dateTo') }}
                    />
                    <RHFDatePicker
                      label="End Date"
                      name="dateTo"
                      size="small"
                      value={dateTo}
                      onChange={(newValue) => { setValue('dateTo', newValue); trigger('dateFrom'); trigger('dateTo') }}
                    />
                    <RHFAutocomplete
                      name="logType"
                      size="small"
                      label="Log Type*"
                      options={machineLogTypeFormats}
                      getOptionLabel={(option) => option.type || ''}
                      isOptionEqualToValue={(option, value) => option?.type === value?.type}
                      onChange={(e, newValue) => handleLogTypeChange(newValue)}
                      renderOption={(props, option) => (<li {...props} key={option?.type}> {option.type || ''} </li> )}
                      disableClearable
                      autoSelect
                      openOnFocus
                      getOptionDisabled={(option) => option?.disabled}
                    />
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" size={isMobile ? 'medium' : 'large'}>
                    Get Logs
                  </LoadingButton>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
      
      {showMachines && activeCustomerMachines?.length > 0 && (
        <Container sx={{ mt: 3 }}>
          <Card sx={{ p: 2 }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<Iconify icon="ep:arrow-down-bold" color={theme.palette.text.secondary} /> } >
                <Typography variant="h4">Available Machines</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  {activeCustomerMachines.map((machine) => (
                    <Box key={machine._id} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body1">
                        {machine.serialNo} - {machine.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Container>
      )}
      {logsData && <MachineLogsList logsData={logsData} />}
    </>
  );
}

export default AllMachineLogs;

