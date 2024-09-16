import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Card, Grid, CardHeader, Divider, IconButton, Container, TextField, Autocomplete, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slices
import { getMachineLogGraphData, setSelectedLogType } from '../../../redux/slices/products/machineErpLogs';
// utils
import { fQuarterYearDate } from '../../../utils/formatTime';
import ChartStacked from '../../../components/Charts/ChartStacked';
import { SkeletonGraph } from '../../../components/skeleton';
import EmptyContent from '../../../components/empty-content';
import Iconify from '../../../components/iconify/Iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import MachineTabContainer from '../util/MachineTabContainer';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';

// ----------------------------------------------------------------------

export default function MachineLogsGraphViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { machineLogsGraphData, selectedLogType, isLoading } = useSelector(
    (state) => state.machineErpLogs
  );
  const { machine } = useSelector((state) => state.machine);
  const [disable, setDisable] = useState(false);
  const [logYearState, setLogYearState] = useState(new Date().getFullYear());
  const erpLogsTime = [];
  const erpLogsLength = [];
  const erpLogsWaste = [];

  useEffect(() => {
    if (machineId) {
      dispatch(
        getMachineLogGraphData(machineId, selectedLogType?.type || 'ERP', logYearState)
      );
    //   if (!response?.success)
    }
  }, [dispatch, machineId, selectedLogType, logYearState]);

  if (Array.isArray(machineLogsGraphData) && machineLogsGraphData?.length !== 0) {
    machineLogsGraphData?.map((log) => {
      erpLogsTime.push(fQuarterYearDate(log._id, 'MMM yyyy'));
      erpLogsLength.push(log.componentLength);
      erpLogsWaste.push(log.waste);
      return null;
    });
  }

  useLayoutEffect(() => {
    if (machine?.status?.slug === 'transferred') {
      setDisable(true);
    } else {
      setDisable(false);
    }
  }, [dispatch, machine]);

  const openRecordsList = () => navigate(PATH_MACHINE.machines.logs.root(machineId));
  const addLogRecord = () => navigate(PATH_MACHINE.machines.logs.new(machineId));

  const onLogTypeChange = (newValue) => dispatch(setSelectedLogType(newValue));

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="logs" />
      <Card sx={{ width: '100%' }}>
        <CardHeader titleTypographyProps={{ variant: 'h4' }} sx={{ mb: 2}} title="Logs Graph" />
        <Grid container spacing={2} sx={{ mb: 2, px: 2 }}>
          <Grid item xs={12} md={4} lg={3}>
            <Autocomplete
              disableClearable
              value={selectedLogType}
              options={machineLogTypeFormats}
              getOptionLabel={(option) => option.type}
              isOptionEqualToValue={(option, val) => option?.type === val?.type}
              onChange={(event, newValue) => onLogTypeChange(newValue)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  size='small' 
                  label="Select Log Type" 
                  inputProps={{
                    ...params.inputProps,
                    readOnly: true,
                    style: { cursor: 'pointer' }
                  }} 
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option?.type}>
                  {option?.type || ''}
                </li>
              )}
              getOptionDisabled={(option) => option?.disabled}
            />
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <FormControl fullWidth>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                label="Year"
                value={logYearState}
                onChange={(event) => setLogYearState(event.target.value)}
                size='small'
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i
                  return (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4} lg={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <StyledTooltip
              title="Log List"
              placement="top"
              disableFocusListener
              tooltipcolor="#103996"
              color="#103996"
            >
              <IconButton
                disabled={disable}
                onClick={openRecordsList}
                color="#fff"
                sx={{
                  background: '#2065D1',
                  borderRadius: 1,
                  height: '1.7em',
                  mx: 2,
                  p: '8.5px 14px',
                  '&:hover': {
                    background: '#103996',
                    color: '#fff',
                  },
                }}
              >
                <Iconify
                  color="#fff"
                  sx={{ height: '24px', width: '24px' }}
                  icon="material-symbols-light:lists-rounded"
                />
              </IconButton>
            </StyledTooltip>

            {!machine?.isArchived && (
              <StyledTooltip
                title="Add Log"
                placement="top"
                disableFocusListener
                tooltipcolor="#103996"
                color="#103996"
              >
                <IconButton
                  disabled={disable}
                  onClick={addLogRecord}
                  color="#fff"
                  sx={{
                    background: '#2065D1',
                    borderRadius: 1,
                    height: '1.7em',
                    p: '8.5px 14px',
                    '&:hover': {
                      background: '#103996',
                      color: '#fff',
                    },
                  }}
                >
                  <Iconify
                    color="#fff"
                    sx={{ height: '24px', width: '24px' }}
                    icon="eva:plus-fill"
                  />
                </IconButton>
              </StyledTooltip>
            )}
          </Grid>
        </Grid>
        <Divider />
        <Grid container display="flex" direction="row">
          <Grid item xs={12}>
            {!isLoading ? (
              <>
                {erpLogsTime.length > 0 && (
                  <ChartStacked
                    chart={{
                      categories: erpLogsTime,
                      series: [
                        { name: 'Length', data: erpLogsLength },
                        { name: 'Waste', data: erpLogsWaste },
                      ],
                    }}
                  />
                )}
              </>
            ) : (
              <SkeletonGraph />
            )}
            {!isLoading && erpLogsTime.length === 0 && (
              <EmptyContent title="No Graph Data Found!" sx={{ color: '#DFDFDF' }} />
            )}
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
