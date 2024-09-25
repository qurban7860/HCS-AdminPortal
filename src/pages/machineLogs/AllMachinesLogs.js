import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Stack, Card, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFAutocomplete, RHFDatePicker } from '../../components/hook-form';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { getMachineLogRecords, ChangePage } from '../../redux/slices/products/machineErpLogs'; 
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
  const { page, rowsPerPage } = useSelector((state) => state.machineErpLogs);
  const [selectedLogTypeTableColumns, setSelectedLogTypeTableColumns] = useState([]);

  const isMobile = useResponsive('down', 'sm');


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
  const { customer, machine, dateFrom, dateTo, logType } = watch();

  useEffect(() => {
    dispatch(getActiveCustomers());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (customer) {
      dispatch(getActiveCustomerMachines(customer._id));
    } else {
      dispatch(resetActiveCustomerMachines());
    }
  }, [dispatch, customer]);

  useEffect(() => {
    const customerId = customer?._id || undefined;
    const machineId = machine?._id || undefined; 
    if (customerId && logType) {
      dispatch(
        getMachineLogRecords({
          customerId,
          machineId,
          page,
          pageSize: rowsPerPage,
          fromDate: dateFrom,
          toDate: dateTo,
          isArchived: machine?.isArchived,
          isMachineArchived: false,
          selectedLogType: logType.type,
        })
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage]);

  const onSubmit = (data) => {
    const customerId = customer._id; 
    const machineId = machine?._id || undefined;
    dispatch(ChangePage(0));
    setSelectedLogTypeTableColumns(machineLogTypeFormats.find(logTypeItem => logTypeItem.type === logType.type)?.tableColumns);
    dispatch(
      getMachineLogRecords({
        customerId,
        machineId,
        page: 0,
        pageSize: rowsPerPage,
        fromDate: dateFrom,
        toDate: dateTo,
        isMachineArchived: machine?.isArchived,
        selectedLogType: logType.type,
      })
    );
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
                    onChange={(newValue) => {
                      setValue('dateFrom', newValue);
                      trigger(['dateFrom', 'dateTo']);
                    }}
                  />
                    <RHFDatePicker
                      label="End Date"
                      name="dateTo"
                      size="small"
                      value={dateTo}
                      onChange={(newValue) => {
                        setValue('dateTo', newValue);
                        trigger(['dateFrom', 'dateTo']);
                      }}
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
      {/* {logsData && ( */}
        <MachineLogsList allMachineLogsPage allMachineLogsColumns={selectedLogTypeTableColumns} />
      {/* )} */}
    </>
  );
}

export default AllMachineLogs;

