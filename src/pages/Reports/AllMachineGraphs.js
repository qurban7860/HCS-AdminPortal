import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, Container, Grid, Stack } from "@mui/material";
import debounce from 'lodash/debounce';
import { machineLogGraphTypes, machineLogTypeFormats } from "../../constants/machineLogTypeFormats";
import { AddMachineLogSchema } from "../schemas/machine";
import { getActiveCustomers } from "../../redux/slices/customer/customer";
import { getActiveCustomerMachines, resetActiveCustomerMachines } from "../../redux/slices/products/machine";
import { getMachineLogGraphData, resetMachineErpLogRecords, resetMachineLogsGraphData } from "../../redux/slices/products/machineErpLogs";
import { Cover } from "../../components/Defaults/Cover";
import { StyledCardContainer } from "../../theme/styles/default-styles";
import { RHFAutocomplete, RHFDatePicker } from "../../components/hook-form";
import ErpProducedLengthLogGraph from "./Graphs/ErpProducedLengthLogGraph";
import ErpProductionRateLogGraph from "./Graphs/ErpProductionRateLogGraph";

const AllMachineGraphs = () => {
  const dispatch = useDispatch();
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);
  const [graphLabels, setGraphLabels] = useState({yaxis: "Produced Length & Waste (m)", xaxis: "Months"});

  const defaultValues = {
    customer: null,
    machine: null,
    logPeriod: "Daily",
    logGraphType: machineLogGraphTypes[0],
    dateFrom: new Date(new Date().setHours(0, 0, 0, 0)),
    dateTo: new Date(new Date().setHours(23, 59, 59, 999)),
  };

  const methods = useForm({
    defaultValues
  });

  const { watch, setValue, trigger } = methods;
  const { customer, machine, logPeriod, logGraphType, dateFrom, dateTo } = watch();

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
    const fetchGraphData = debounce(() => {
      if (customer && logPeriod && logGraphType?.key && dateFrom && dateTo) {
        const customerId = customer._id;
        const machineId = machine?._id || undefined;
        const LogType = 'erp';
        dispatch(getMachineLogGraphData(
          customerId,
          machineId,
          LogType,
          logPeriod,
          logGraphType.key,
          new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
          new Date(new Date(dateTo).setHours(23, 59, 59, 999))
        ));
      }
      if (!customer) {
        dispatch(resetMachineLogsGraphData());
      }
    }, 500); 
    fetchGraphData();
    return () => {
      fetchGraphData.cancel(); 
    };
  }, [customer, machine?._id, logPeriod, logGraphType?.key, dateFrom, dateTo, dispatch]);
  
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

  const handlePeriodChange = useCallback((newPeriod) => {
    setValue('logPeriod', newPeriod);
    switch (newPeriod) {
      case 'Hourly':
        setGraphLabels((prev) => ({...prev, xaxis: "Hours"}));
        break;
      case 'Monthly':
        setGraphLabels((prev) => ({...prev, xaxis: "Months"}))
        break;
      case 'Daily':
        setGraphLabels((prev) => ({...prev, xaxis: "Days"}))
        break;
      case 'Quarterly':
        setGraphLabels((prev) => ({...prev, xaxis: "Quarters"}))
        break;
      case 'Yearly':
        setGraphLabels((prev) => ({...prev, xaxis: "Years"}))
        break;
      default:
        break;
    }
  }, [setValue]);

  const handleGraphTypeChange = useCallback((newGraphType) => {
    setValue('logGraphType', newGraphType);
  }, [setValue]);

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name="ERP Graphs" />
      </StyledCardContainer>
      <FormProvider {...methods}>
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
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Box sx={{ width: '50%' }}>
                    <RHFAutocomplete
                      name="logPeriod"
                      label="Period*"
                      options={['Hourly', 'Daily', 'Monthly', 'Quarterly', 'Yearly']}
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
                <Box
                  display="grid"
                  gap={2}
                  gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }}
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
                  </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
      {logGraphType.key === 'length_and_waste' ? (
        <ErpProducedLengthLogGraph
          timePeriod={logPeriod}
          customer={machine?.customer}
          graphLabels={graphLabels}
        />
      ) : (
        <ErpProductionRateLogGraph timePeriod={logPeriod} customer={machine?.customer} />
      )}
    </Container>
  );
}

export default AllMachineGraphs;
