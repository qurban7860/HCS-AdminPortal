import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Box, Card, Container, Grid, Stack, useTheme } from '@mui/material';
import { machineLogGraphTypes, machineLogTypeFormats } from "../../constants/machineLogTypeFormats";
import { AddMachineLogSchema } from "../schemas/machine";
import { getActiveCustomers } from "../../redux/slices/customer/customer";
import { getActiveCustomerMachines, resetActiveCustomerMachines } from "../../redux/slices/products/machine";
import { getMachineLogGraphData, resetMachineErpLogRecords, resetMachineLogsGraphData } from "../../redux/slices/products/machineErpLogs";
import { Cover } from "../../components/Defaults/Cover";
import { StyledCardContainer, StyledContainedIconButton, StyledTooltip } from "../../theme/styles/default-styles";
import { RHFAutocomplete, RHFDatePicker } from "../../components/hook-form";
import ErpProducedLengthLogGraph from "./Graphs/ErpProducedLengthLogGraph";
import ErpProductionRateLogGraph from "./Graphs/ErpProductionRateLogGraph";
import Iconify from '../../components/iconify';

const AllMachineGraphs = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);

  const [graphLabels, setGraphLabels] = useState({ yaxis: 'Produced Length & Waste (m)', xaxis: 'Daily' });

  const [formData, setFormData] = useState(null);

  const defaultValues = {
    customer: null,
    machine: null,
    logPeriod: 'Daily',
    logGraphType: machineLogGraphTypes[0],
    dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    dateTo: new Date(),
  };

  const methods = useForm({
     defaultValues
     });
  const { setValue, trigger, handleSubmit, getValues } = methods;

  useEffect(() => {
    dispatch(getActiveCustomers());
  }, [dispatch]);

  useEffect(() => {
    const selectedCustomer = getValues('customer');
    if (selectedCustomer) {
      dispatch(getActiveCustomerMachines(selectedCustomer._id));
    } else {
      dispatch(resetActiveCustomerMachines());
      dispatch(resetMachineLogsGraphData());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, getValues('customer')]);

  const onSubmit = (data) => {
    setFormData(data);

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

                  <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    <Box sx={{ width: '50%' }}>
                      <RHFAutocomplete
                        name="logPeriod"
                        label="Period*"
                        options={['Hourly', 'Daily', 'Monthly', 'Quarterly', 'Yearly']}
                        size="small"
                        disableClearable
                      />
                    </Box>
                    <Box sx={{ width: '50%' }}>
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
                      />
                    </Box>
                  </Stack>

                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                      <RHFDatePicker
                        label="Date From"
                        name="dateFrom"
                        size="small"
                        onChange={(newValue) => setValue('dateFrom', newValue)}
                        fullWidth
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                      <RHFDatePicker
                        label="Date To"
                        name="dateTo"
                        size="small"
                        onChange={(newValue) => setValue('dateTo', newValue)}
                        fullWidth
                      />
                    </Box>
                    <Box sx={{ justifyContent: 'flex-end', display: 'flex' }}>
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
                    </Box>
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </form>
      </FormProvider>

      {formData?.logGraphType?.key === 'length_and_waste' ? (
        <ErpProducedLengthLogGraph timePeriod={formData?.logPeriod} customer={formData?.machine?.customer} graphLabels={graphLabels} dateFrom={formData?.dateFrom} dateTo={formData?.dateTo} />
      ) : (
        <ErpProductionRateLogGraph timePeriod={formData?.logPeriod} customer={formData?.machine?.customer} dateFrom={formData?.dateFrom} dateTo={formData?.dateTo} />
      )}
    </Container>
  );
};

export default AllMachineGraphs;
