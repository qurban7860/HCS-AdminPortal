import PropTypes from 'prop-types';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm,Controller } from 'react-hook-form';
// @mui


import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Card, Container, Stack, Typography, Box, useTheme, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { RHFAutocomplete, RHFDatePicker,RHFDateTimePicker } from '../../../components/hook-form';
import { machineLogGraphTypes } from '../../../constants/machineLogTypeFormats';
import MachineTabContainer from '../util/MachineTabContainer';
import Iconify from '../../../components/iconify';
import { StyledTooltip, StyledContainedIconButton } from '../../../theme/styles/default-styles';
import ErpProducedLengthLogGraph from '../../Reports/Graphs/ErpProducedLengthLogGraph';
import ErpProductionRateLogGraph from '../../Reports/Graphs/ErpProductionRateLogGraph';
import { getMachineLogGraphData } from '../../../redux/slices/products/machineErpLogs';
import TimeDisplay from '../../../components/timeZone/TimeZone';


MachineLogsGraphViewForm.propTypes = {
  machineId: PropTypes.bool,
};

export default function MachineLogsGraphViewForm() {
  const [graphLabels, setGraphLabels] = useState({
    yaxis: 'Produced Length & Waste (m)',
    xaxis: 'Daily',
  });
  const [triggerFetch, setTriggerFetch] = useState(null);

  const dispatch = useDispatch();
  const { machineId } = useParams();
  const { machine } = useSelector((state) => state.machine);
  const theme = useTheme();

  const defaultValues = useMemo(
    () => ({
      logPeriod: 'Daily',
      logGraphType: machineLogGraphTypes[0],
    // dateFrom: new Date(new Date().setHours(0, 0, 0, 0)),
    // dateTo: new Date(new Date().setHours(23, 59, 59, 0)),
      dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dateTo: new Date(),
    }),
    []
  )

  const methods = useForm({
    defaultValues,
  });

  const { setValue, getValues, handleSubmit } = methods;

  const handleFormSubmit = useCallback(() => {
    const { logPeriod, logGraphType, dateFrom, dateTo } = getValues();
    const customerId = machine?.customer?._id;
    if (!customerId || !logGraphType?.key) return;

    const payload = { logPeriod, logGraphType, dateFrom, dateTo };
    setTriggerFetch(payload);

    dispatch(
      getMachineLogGraphData(
        customerId,
        machineId,
        'erp',
        logPeriod,
        logGraphType.key,
        dateFrom,
        dateTo
      )
    );

    setGraphLabels({
      yaxis:
        logGraphType.key === 'productionRate'
          ? 'Production Rate (m/hr)'
          : 'Produced Length and Waste (m)',
      xaxis: logPeriod,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, machine?.customer?._id, machineId]);

  useEffect(() => {
    if (
      defaultValues?.logGraphType &&
      defaultValues?.logPeriod &&
      defaultValues?.dateFrom &&
      defaultValues?.dateTo &&
      machine?.customer?._id
    ) {
      const { logPeriod, logGraphType, dateFrom, dateTo } = defaultValues;
      const customerId = machine?.customer?._id;

      const payload = { logPeriod, logGraphType, dateFrom, dateTo };
      setTriggerFetch(payload);

      dispatch(
        getMachineLogGraphData(
          customerId,
          machineId,
          'erp',
          logPeriod,
          logGraphType.key,
          dateFrom,
          dateTo
        )
      );

      setGraphLabels({
        yaxis:
          logGraphType.key === 'productionRate'
            ? 'Production Rate (m/hr)'
            : 'Produced Length and Waste (m)',
        xaxis: logPeriod,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues, machine?.customer?._id, machineId]);

  const handlePeriodChange = useCallback(
    (newPeriod) => {
      setValue('logPeriod', newPeriod);
    },
    [setValue]
  );

  const handleGraphTypeChange = useCallback(
    (newGraphType) => {
      setValue('logGraphType', newGraphType);
    },
    [setValue]
  );

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="graphs" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h5" sx={{ pb: 1 }}>
                Log Graphs   
              </Typography>
             
             

              <Grid container gap={1.5}>
                <Grid item xs={12} sm={6} md={3} xl={3}>
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
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2} xl={2.5}>
                  <RHFAutocomplete
                    name="logPeriod"
                    label="Period*"
                    options={['Hourly', 'Daily', 'Monthly', 'Quarterly', 'Yearly']}
                    onChange={(e, newValue) => handlePeriodChange(newValue)}
                    size="small"
                    disableClearable
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2} xl={2.5}>
                <RHFDatePicker
                    label="Date From"
                    name="dateFrom"
                    size="small"
                    onChange={(newValue) => setValue('dateFrom', newValue)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2} xl={2.5}>
                  <RHFDatePicker
                    label="Date To"
                    name="dateTo"
                    size="small"
                    onChange={(newValue) => setValue('dateTo', newValue)}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2} xl={1}  sx={{ display: 'flex', justifyContent: 'flex-end' }} >
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
        </form>
      </FormProvider>

      {triggerFetch?.logGraphType?.key === 'length_and_waste' ? (
        <ErpProducedLengthLogGraph
          timePeriod={graphLabels?.xaxis}
          customer={machine?.customer}
          graphLabels={graphLabels}
          dateFrom={triggerFetch?.dateFrom}
          dateTo={triggerFetch?.dateTo}
        />
      ) : (
        <ErpProductionRateLogGraph
          timePeriod={graphLabels?.xaxis}
          customer={machine?.customer}
          graphLabels={graphLabels}
          dateFrom={triggerFetch?.dateFrom}
          dateTo={triggerFetch?.dateTo}
        />
      )}
    </Container>
  );
}
