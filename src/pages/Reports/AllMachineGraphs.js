/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card, Container, Grid, Stack, useTheme } from '@mui/material';
import { machineLogGraphTypes, machineLogTypeFormats } from "../../constants/machineLogTypeFormats";
import { AddMachineGraphSchema } from "../schemas/machine";
import { getActiveCustomers } from "../../redux/slices/customer/customer";
import { getActiveCustomerMachines, resetActiveCustomerMachines } from "../../redux/slices/products/machine";
import { getMachineLogGraphData, resetMachineErpLogRecords, resetMachineLogsGraphData } from "../../redux/slices/products/machineErpLogs";
import { Cover } from "../../components/Defaults/Cover";
import { StyledCardContainer, StyledContainedIconButton, StyledTooltip } from "../../theme/styles/default-styles";
import { RHFAutocomplete, RHFDatePicker,RHFDateTimePicker } from "../../components/hook-form";
import ErpProducedLengthLogGraph from "./Graphs/ErpProducedLengthLogGraph";
import ErpProductionRateLogGraph from "./Graphs/ErpProductionRateLogGraph";
import Iconify from '../../components/iconify';
import TableNoData from "../../components/table/TableNoData";

const AllMachineGraphs = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const graphDataRef = useRef(null); 
  
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);
  const [graphLabels, setGraphLabels] = useState({ yaxis: 'Produced Length & Waste (m)', xaxis: 'Daily' });


  const defaultValues = {
    customer: null,
    machine: null,
    logPeriod: 'Daily',
    logGraphType: machineLogGraphTypes[0],
    // dateFrom: new Date(new Date().setHours(0, 0, 0, 0)),
    // dateTo: new Date(new Date().setHours(23, 59, 59, 0)),
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dateTo: new Date(),
  };

  const methods = useForm({
    resolver: yupResolver(AddMachineGraphSchema),
    mode: 'onBlur',
    defaultValues
  });

  const { setValue, trigger, handleSubmit, getValues, watch } = methods;

  const { customer, machine, logPeriod, logGraphType, dateFrom, dateTo } = watch();
  
  useEffect(() => {
    const now = new Date();
    const newDateFrom = new Date(now);

    switch (logPeriod) {
    case 'Hourly':
      newDateFrom.setHours(0, 0, 0, 0);
      now.setHours(23, 59, 59, 999);
      break;

    case 'Daily':
      newDateFrom.setDate(newDateFrom.getDate() - 30);
      newDateFrom.setHours(0, 0, 0, 0);
      now.setHours(23, 59, 59, 999);
      break;

    case 'Monthly':
      newDateFrom.setMonth(newDateFrom.getMonth() - 11);
      newDateFrom.setDate(1);
      newDateFrom.setHours(0, 0, 0, 0);
      now.setHours(23, 59, 59, 999);
      break;

    case 'Quarterly':
      newDateFrom.setMonth(newDateFrom.getMonth() - 35);
      newDateFrom.setMonth(Math.floor(newDateFrom.getMonth() / 3) * 3, 1);
      newDateFrom.setHours(0, 0, 0, 0);
      now.setHours(23, 59, 59, 999);
      break;

    case 'Yearly':
      newDateFrom.setFullYear(newDateFrom.getFullYear() - 9);
      newDateFrom.setMonth(0, 1);
      newDateFrom.setHours(0, 0, 0, 0);
      now.setHours(23, 59, 59, 999);
      break;

    default:
      newDateFrom.setDate(newDateFrom.getDate() - 30);
      newDateFrom.setHours(0, 0, 0, 0);
      now.setHours(23, 59, 59, 999);
      break;
  }
    setValue('dateTo', now);
    setValue('dateFrom', newDateFrom);
    trigger(['dateFrom', 'dateTo']);
  }, [logPeriod, setValue, trigger]);

  useEffect(() => {
    dispatch(getActiveCustomers());
  }, [dispatch]);

  useEffect(() => {
    const selectedCustomer = getValues('customer');
    if (selectedCustomer) {
      dispatch(getActiveCustomerMachines(selectedCustomer._id));
    } else {
      dispatch(resetActiveCustomerMachines());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getValues('customer')]);

  const onSubmit = (data) => {
    if (data?.logGraphType?.key === 'productionRate') {
      setGraphLabels({
        yaxis: 'Production Rate (m/hr)',
        xaxis: data?.logPeriod,
      });
    } else {
      setGraphLabels({
        yaxis: 'Produced Length and Waste (m)',
        xaxis: data?.logPeriod,
      });
    }

    graphDataRef.current = { ...data, graphLabels };

    const customerId = data.customer?._id;
    const machineId = data.machine?._id || undefined;
    const LogType = 'erp';

    if (customerId && data.logPeriod && data.logGraphType?.key && data.dateFrom && data.dateTo) {
      dispatch(
        getMachineLogGraphData(
          customerId,
          machineId,
          LogType,
          data.logPeriod,
          data.logGraphType.key,
          data.dateFrom,
          data.dateTo
        )
      );
    }
  };

  const handleCustomerChange = useCallback(
    (newCustomer) => {
      setValue('customer', newCustomer);
      setValue('machine', null);
      trigger(['customer', 'machine']);
      dispatch(resetMachineErpLogRecords());
    },
    [dispatch, setValue, trigger]
  );

  const handleMachineChange = useCallback(
    (newMachine) => {
      setValue('machine', newMachine);
      trigger('machine');
      dispatch(resetMachineErpLogRecords());
    },
    [dispatch, setValue, trigger]
  );

  const graphData = graphDataRef.current;

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="ERP Graphs" />
      </StyledCardContainer>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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

                  <Grid container alignItems="flex-start" gap={1}>
                    <Grid item xs={12} sm={6} md={2.5} xl={3.5} >
                      <RHFAutocomplete
                        name="logGraphType"
                        label="Graph Type*"
                        options={machineLogGraphTypes}
                        getOptionLabel={(option) => option.name || ''}
                        isOptionEqualToValue={(option, value) => option?.key === value?.key}
                        renderOption={(props, option) => (
                          <li {...props} key={option?.key}>
                            {option.name || ''}
                          </li>
                        )}
                        disableClearable
                        size="small"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.5} xl={3}>
                      <RHFAutocomplete
                        name="logPeriod"
                        label="Period*"
                        options={['Hourly', 'Daily', 'Monthly', 'Quarterly', 'Yearly']}
                        size="small"
                        disableClearable
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.5} xl={2}>
                      <RHFDatePicker
                        label="Date From"
                        name="dateFrom"
                        size="small"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={2.5} xl={2}>
                      <RHFDatePicker
                        label="Date To"
                        name="dateTo"
                        size="small"
                        fullWidth
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={1} sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                      <StyledTooltip
                        title="Fetch Graph"
                        placement="top"
                        disableFocusListener
                        tooltipcolor={theme.palette.primary.main}
                      >
                        <StyledContainedIconButton type="submit" sx={{ px: 2 }}>
                          <Iconify sx={{ height: '24px', width: '24px' }} icon="mdi:text-search" />
                        </StyledContainedIconButton>
                      </StyledTooltip>
                    </Grid>
                  </Grid>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      {graphData ? (
        graphData.logGraphType?.key === 'length_and_waste' ? (
          <ErpProducedLengthLogGraph
            timePeriod={graphData.logPeriod}
            customer={graphData.machine?.customer}
            graphLabels={graphData.graphLabels}
            dateFrom={graphData.dateFrom}
            dateTo={graphData.dateTo}
          />
        ) : (
          <ErpProductionRateLogGraph
            timePeriod={graphData.logPeriod}
            customer={graphData.machine?.customer}
            dateFrom={graphData.dateFrom}
            dateTo={graphData.dateTo}
          />
        )
      ) : (
        <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, minHeight: 500 }}>
          <TableNoData isNotFound />
        </Card>
      )}
    </Container>
  );
};

export default AllMachineGraphs;
