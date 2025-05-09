import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Stack, Card, Container, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import FormProvider, { RHFAutocomplete, RHFDatePicker } from '../../components/hook-form';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { getMachineLogRecords, ChangePage, resetMachineErpLogRecords } from '../../redux/slices/products/machineErpLogs';
import { AddMachineLogSchema } from '../schemas/machine';
// import useResponsive from '../../hooks/useResponsive';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer, StyledContainedIconButton, StyledTooltip } from '../../theme/styles/default-styles';
import { machineLogTypeFormats } from '../../constants/machineLogTypeFormats';
import RHFFilteredSearchBar from '../../components/hook-form/RHFFilteredSearchBar';
import MachineLogsDataTable from '../machine/logs/MachineLogsDataTable';
import DownloadMachineLogsIconButton from '../../components/machineLogs/DownloadMachineLogsIconButton';
import Iconify from '../../components/iconify';

function AllMachineLogs() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { page, rowsPerPage } = useSelector((state) => state.machineErpLogs);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');

  // const isMobile = useResponsive('down', 'sm');

  const defaultValues = {
    customer: null,
    machine: null,
    logType: machineLogTypeFormats.find(option => option.type === 'ERP') || null,
    dateFrom: new Date(new Date().setHours(0, 0, 0, 0)),
    dateTo: new Date(new Date().setHours(23, 59, 59, 999)),
  };

  const methods = useForm({
    resolver: yupResolver(AddMachineLogSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, trigger } = methods;
  const { customer, machine, dateFrom, dateTo, logType, filteredSearchKey } = watch();

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

  const onGetLogs = (data) => {
    const customerId = customer._id;
    const machineId = machine?._id || undefined;
    dispatch(ChangePage(0));
    dispatch(
      getMachineLogRecords({
        customerId,
        machineId,
        page: 0,
        pageSize: rowsPerPage,
        fromDate: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
        toDate: new Date(new Date(dateTo).setHours(23, 59, 59, 999)),
        isMachineArchived: machine?.isArchived,
        isArchived: false,
        selectedLogType: logType.type,
        searchKey: filteredSearchKey,
        searchColumn: selectedSearchFilter,
      })
    );
  };

  const handleCustomerChange = useCallback((newCustomer) => {
    setValue('customer', newCustomer);
    setValue('machine', null);
    trigger(['customer', 'machine']);
    dispatch(resetMachineErpLogRecords());
  }, [dispatch, setValue, trigger]);

  const handleMachineChange = useCallback((newMachine) => {
    setValue('machine', newMachine);
    trigger('machine');
    dispatch(resetMachineErpLogRecords());
  }, [dispatch, setValue, trigger]);

  const handleLogTypeChange = useCallback((newLogType) => {
    setValue('logType', newLogType);
    trigger('logType');
  }, [setValue, trigger]);

  const dataForApi = {
    customerId: customer?._id || machine?.customer?._id,
    machineId: machine?._id || undefined,
    page,
    pageSize: rowsPerPage,
    fromDate: dateFrom,
    toDate: dateTo,
    isArchived: false,
    isMachineArchived: false,
    selectedLogType: logType?.type,
    searchKey: filteredSearchKey,
    searchColumn: selectedSearchFilter,
  };

  
  const returnSearchFilterColumnOptions = () =>
    logType?.tableColumns.filter((item) => item?.searchable)

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Machine Logs" />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onGetLogs)}>
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
                    label="Customer*"
                    options={activeCustomers || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option?.name || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>
                        {' '}
                        {option?.name || ''}{' '}
                      </li>
                    )}
                    onChange={(e, newValue) => handleCustomerChange(newValue)}
                    size="small"
                  />
                  <RHFAutocomplete
                    name="machine"
                    label="Machine"
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
                  sx={{ flexGrow: 1 }}
                >
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
                    renderOption={(props, option) => (
                      <li {...props} key={option?.type}>
                        {option.type || ''}
                      </li>
                    )}
                    disableClearable
                    autoSelect
                    openOnFocus
                    getOptionDisabled={(option) => option?.disabled}
                  />
                </Box>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                    <RHFFilteredSearchBar
                      name="filteredSearchKey"
                      filterOptions={returnSearchFilterColumnOptions()}
                      setSelectedFilter={setSelectedSearchFilter}
                      selectedFilter={selectedSearchFilter}
                      placeholder="Enter Search here..."
                      fullWidth
                    />
                  </Box>
                    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                      <StyledTooltip
                        title="Fetch Logs"
                        placement="top"
                        disableFocusListener
                        tooltipcolor={theme.palette.primary.main}
                      >
                        <StyledContainedIconButton type="submit" sx={{px: 2}}>
                          <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:text-search" />
                        </StyledContainedIconButton>
                      </StyledTooltip>
                    </Box>
                  <Box sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                    <DownloadMachineLogsIconButton dataForApi={dataForApi} />
                  </Box>
                </Stack>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      <MachineLogsDataTable allMachineLogsPage dataForApi={dataForApi} logType={logType} />
    </Container>
  );
}

export default AllMachineLogs;

