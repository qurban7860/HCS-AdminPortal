import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Stack, Card, Container } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useSearchParams } from 'react-router-dom';
import FormProvider, { RHFAutocomplete, RHFDatePicker } from '../../components/hook-form';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveCustomers } from '../../redux/slices/customer/customer';
import { getMachineLogRecords, ChangePage, getMachineLogGraphData, resetMachineLogsGraphData } from '../../redux/slices/products/machineErpLogs';
import { AddMachineLogSchema } from '../schemas/machine';
// import useResponsive from '../../hooks/useResponsive';
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { machineLogTypeFormats, machineLogGraphTypes } from '../../constants/machineLogTypeFormats';
import RHFFilteredSearchBar from '../../components/hook-form/RHFFilteredSearchBar';
import MachineLogsDataTable from '../machine/logs/MachineLogsDataTable';
import ErpProducedLengthLogGraph from './graph/ErpProducedLengthLogGraph';
import ErpProductionRateLogGraph from './graph/ErpProductionRateLogGraph';

function AllMachineLogs() {
  const dispatch = useDispatch();
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { page, rowsPerPage } = useSelector((state) => state.machineErpLogs);
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');
  const [searchParams] = useSearchParams();

  // const isMobile = useResponsive('down', 'sm');

  const defaultValues = {
    customer: null,
    machine: null,
    logType: machineLogTypeFormats.find(option => option.type === 'ERP') || null,
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dateTo: new Date(),
    logPeriod: "Monthly",
    logGraphType: machineLogGraphTypes[0]
  };

  const methods = useForm({
    resolver: yupResolver(AddMachineLogSchema),
    defaultValues,
  });

  const { watch, setValue, handleSubmit, trigger } = methods;
  const { customer, machine, dateFrom, dateTo, logType, filteredSearchKey, logPeriod, logGraphType } = watch();

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
    if (isGraphPage() && customer && logPeriod && logGraphType) {
      const customerId = customer._id;
      const machineId = machine?._id || undefined;
      const LogType = 'erp';
      dispatch(getMachineLogGraphData(customerId, machineId, LogType, logPeriod, logGraphType?.key));
    }
    if (!customer) dispatch(resetMachineLogsGraphData());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, machine, logPeriod, searchParams, logGraphType]);

  const onGetLogs = (data) => {
    const customerId = customer._id;
    const machineId = machine?._id || undefined;
    // setShowErpLogs(false);
    dispatch(ChangePage(0));
    dispatch(
      getMachineLogRecords({
        customerId,
        machineId,
        page: 0,
        pageSize: rowsPerPage,
        fromDate: dateFrom,
        toDate: dateTo,
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
  }, [setValue, trigger]);

  const handleMachineChange = useCallback((newMachine) => {
    setValue('machine', newMachine);
    trigger('machine');
  }, [setValue, trigger]);

  const handleLogTypeChange = useCallback((newLogType) => {
    setValue('logType', newLogType);
    trigger('logType');
  }, [setValue, trigger]);

  const handlePeriodChange = useCallback((newPeriod) => {
    setValue('logPeriod', newPeriod);
  }, [setValue]);

  const handleGraphTypeChange = useCallback((newGraphType) => {
    setValue('logGraphType', newGraphType);
  }, [setValue]);

  const dataForApi = {
    customerId: machine?.customer?._id,
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

  const isGraphPage = () => searchParams.get('type') === "erpGraph"

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="Machine Logs" erpLogGraphsToggle />
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
                {!isGraphPage() && (
                  <>
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
                          filterOptions={logType?.tableColumns}
                          setSelectedFilter={setSelectedSearchFilter}
                          selectedFilter={selectedSearchFilter}
                          placeholder="Enter Search here..."
                          fullWidth
                        />
                      </Box>
                      <Box sx={{ justifyContent: 'flex-end', display: 'flex' }}>
                        <LoadingButton
                          type="button"
                          onClick={handleSubmit(onGetLogs)}
                          variant="contained"
                          size="large"
                        >
                          Get Logs
                        </LoadingButton>
                        {/* <LoadingButton type="button" onClick={handleSubmit(onGetReport)} variant="contained" size="large">
                            Get Graph
                          </LoadingButton> */}
                      </Box>
                    </Stack>
                  </>
                )}
                {isGraphPage() && (
                  <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    <Box sx={{ width: '50%' }}>
                      <RHFAutocomplete
                        name="logPeriod"
                        label="Period*"
                        options={['Daily', 'Monthly', 'Quarterly', 'Yearly']}
                        onChange={(e, newValue) => handlePeriodChange(newValue)}
                        size="small"
                        disableClearable
                      />
                    </Box>
                    <Box sx={{ width: '50%' }}>
                      <RHFAutocomplete
                        name="logGraphType"
                        label="Graph Type*"
                        options={machineLogGraphTypes}
                        onChange={(e, newValue) => handleGraphTypeChange(newValue)}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option?.key === value?.key}
                        renderOption={(props, option) => (
                          <li {...props} key={option?.key}>
                            {option.name || ''}
                          </li>
                        )}
                        disableClearable
                        size="small"
                      />
                    </Box>
                  </Stack>
                )}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      {!isGraphPage() && (
        <MachineLogsDataTable allMachineLogsPage dataForApi={dataForApi} logType={logType} />
      )}
      {isGraphPage() && (
        <>
          {logGraphType.key === 'length_and_waste' ? (
            <ErpProducedLengthLogGraph timePeriod={logPeriod} customer={machine?.customer?._id} />
          ) : (
            <ErpProductionRateLogGraph timePeriod={logPeriod} customer={machine?.customer?._id} />
          )}
        </>
      )}
    </Container>
  );
}

export default AllMachineLogs;

