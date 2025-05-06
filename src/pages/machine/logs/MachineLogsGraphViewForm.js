import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
// @mui
import { Card, Container, Stack, Typography, Box } from '@mui/material';
// routes
import { useParams } from 'react-router-dom';
// slices
import { getMachineLogGraphData } from '../../../redux/slices/products/machineErpLogs';
// utils
import { machineLogGraphTypes } from '../../../constants/machineLogTypeFormats';
import MachineTabContainer from '../util/MachineTabContainer';
import ErpProducedLengthLogGraph from '../../Reports/Graphs/ErpProducedLengthLogGraph';
import ErpProductionRateLogGraph from '../../Reports/Graphs/ErpProductionRateLogGraph';
import { RHFAutocomplete } from '../../../components/hook-form';

// ----------------------------------------------------------------------

MachineLogsGraphViewForm.propTypes = {
  machineId: PropTypes.bool,
};

export default function MachineLogsGraphViewForm() {
  const [graphLabels, setGraphLabels] = useState({yaxis: "Produced Length & Waste (m)", xaxis: "Months"});

  const dispatch = useDispatch();  
  const { machineId } = useParams();
  const { machine } = useSelector((state) => state.machine);

  const methods = useForm({
    defaultValues: {
      logPeriod: "Monthly",
      logGraphType: machineLogGraphTypes[0]
    },
  });

  const { watch, setValue } = methods;
  const { logPeriod, logGraphType } = watch();

  useEffect(() => {
    if (logGraphType?.key === 'productionRate') {
      setGraphLabels(prev => ({ ...prev, yaxis: 'Production Rate (m/hr)' }))
    } else {
      setGraphLabels(prev => ({ ...prev, yaxis: 'Produced Length and Waste (m)' }))
    }
  }, [logGraphType])

  useEffect(() => {
    if (logPeriod && logGraphType) {
      const customerId = machine?.customer?._id;
      const LogType = 'erp';
      dispatch(getMachineLogGraphData(customerId, machineId, LogType, logPeriod, logGraphType?.key));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logPeriod, logGraphType]);

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
      <MachineTabContainer currentTabValue="graphs" />
      <FormProvider {...methods}>
        <form>
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignSelf: 'flex-start', alignItems: 'center',  mb: 3 }}
                >
                  <Box sx={{ pb: 1 }}>
                    <Typography variant="h5" color="text.primary">
                      Log Graphs
                    </Typography>
                  </Box>
                </Stack>
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
            </Stack>
          </Card>
        </form>
      </FormProvider>
        {logGraphType.key === 'length_and_waste' ? (
          <ErpProducedLengthLogGraph timePeriod={logPeriod} customer={machine?.customer} graphLabels={graphLabels} />
        ) : (
          <ErpProductionRateLogGraph timePeriod={logPeriod} customer={machine?.customer} graphLabels={graphLabels} />
        )}
    </Container>
  );
}
