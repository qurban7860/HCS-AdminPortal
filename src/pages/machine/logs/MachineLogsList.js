import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import { Container, Card, Stack, Box, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// routes
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  getMachineLogRecords,
  ChangePage
} from '../../../redux/slices/products/machineErpLogs';
import MachineTabContainer from '../util/MachineTabContainer';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';
import { RHFAutocomplete, RHFDatePicker} from '../../../components/hook-form';
// import RHFFilteredSearchBar from '../../../components/hook-form/RHFFilteredSearchBar';
import { fetchIndMachineLogSchema } from '../../schemas/machine';
import { BUTTONS } from '../../../constants/default-constants';
import Iconify from '../../../components/iconify';
import { StyledTooltip, StyledContainedIconButton } from '../../../theme/styles/default-styles';
import { PATH_MACHINE } from '../../../routes/paths';
import MachineLogsDataTable from './MachineLogsDataTable';
import DownloadMachineLogsIconButton from '../../../components/machineLogs/DownloadMachineLogsIconButton';
import RHFMultiFilteredSearchBar from '../../../components/hook-form/RHFMultiFilteredSearchBar';

// ----------------------------------------------------------------------

MachineLogsList.propTypes = {
  allMachineLogsType: PropTypes.object
};

export default function MachineLogsList({ allMachineLogsType }) {
  // const [selectedSearchFilter, setSelectedSearchFilter] = useState('');
  const [selectedMultiSearchFilter, setSelectedMultiSearchFilter] = useState([]);
  const [unit, setUnit] = useState('Metric');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { machineId } = useParams();
  const methods = useForm({
    defaultValues: {
      logType: machineLogTypeFormats.find(option => option.type === 'ERP') || null,
      dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      dateTo: new Date(),
      unitType: 'Metric',
      filteredSearchKey: '',
    },
    resolver: yupResolver(fetchIndMachineLogSchema),
    mode: 'all',
    reValidateMode: 'onChange'
  });

  const { watch, setValue, handleSubmit, trigger, formState: { isSubmitting } } = methods;
  const { dateFrom, dateTo, unitType, logType, filteredSearchKey } = watch();

  useEffect(() => {
    handleResetFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { page, rowsPerPage } = useSelector((state) => state.machineErpLogs);
  const { machine } = useSelector((state) => state.machine);

  const handleResetFilter = () => {
    setValue(filteredSearchKey, '')
  };

    const convertToMmForSendingData = useCallback((data, columnsSelected) => {
      // eslint-disable-next-line no-restricted-globals
      if (!isNaN(data) && columnsSelected.every(col => logType?.tableColumns?.some(c => c.id === col && c.baseUnit === "m"))) {
        return (data * 1000).toString()
      }
      return data
    }, [logType?.tableColumns])

  const dataForApi = {
    customerId: machine?.customer?._id,
    machineId,
    page,
    pageSize: rowsPerPage,
    fromDate: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
    toDate: new Date(new Date(dateTo).setHours(23, 59, 59, 999)),
    isMachineArchived: false,
    selectedLogType: logType?.type,
    searchKey: convertToMmForSendingData(filteredSearchKey, selectedMultiSearchFilter),
    searchColumn: selectedMultiSearchFilter,
  };

  const onSubmit = (data) => {
    setUnit(unitType);
    dispatch(ChangePage(0));
    dispatch(
      getMachineLogRecords({
        customerId: machine?.customer?._id,
        machineId,
        page: 0,
        pageSize: rowsPerPage,
        fromDate: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
        toDate: new Date(new Date(dateTo).setHours(23, 59, 59, 999)),
        isMachineArchived: machine?.isArchived,
        selectedLogType: logType.type,
        searchKey: convertToMmForSendingData(filteredSearchKey, selectedMultiSearchFilter),
        searchColumn: selectedMultiSearchFilter
      })
    );
  };

  const handleLogTypeChange = useCallback((newLogType) => {
    setValue('logType', newLogType);
    trigger('logType');
  }, [setValue, trigger]);

  const showAddbutton = () => {
    if (machine?.status?.slug === 'transferred') return false;
    if (machine?.isArchived) return false;
    return BUTTONS.ADD_MACHINE_LOGS;
  };

  const returnSearchFilterColumnOptions = () =>
    logType?.tableColumns.filter((item) => item?.searchable && item?.page !== "allMachineLogs")

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="logs" />
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card sx={{ p: 2 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', mb: 3 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignSelf: 'flex-start', alignItems: 'center' }}
                >
                  <Box sx={{ pb: 1 }}>
                    <Typography variant="h5" color="text.primary">
                      Machine Logs
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignSelf: 'flex-end' }}>
                  {showAddbutton() && (
                    <StyledTooltip
                      title={showAddbutton()}
                      placement="top"
                      disableFocusListener
                      tooltipcolor={theme.palette.primary.main}
                    >
                      <StyledContainedIconButton
                        onClick={() => navigate(PATH_MACHINE.machines.logs.new(machineId))}
                        sx={{ px: 2 }}
                      >
                        <Iconify sx={{ height: '24px', width: '24px' }} icon="eva:plus-fill" />
                      </StyledContainedIconButton>
                    </StyledTooltip>
                  )}
                </Stack>
              </Stack>
              {/* <Divider variant="middle" /> */}
              <Box
                display="grid"
                gap={2}
                gridTemplateColumns={{ xs: '1fr', sm: 'repeat(3, 1fr)' }}
                sx={{ flexGrow: 1 }}
              >
                <RHFDatePicker
                  label="Date From"
                  name="dateFrom"
                  size="small"
                  value={dateFrom}
                  onChange={(newValue) => {
                    setValue('dateFrom', newValue);
                    trigger(['dateFrom', 'dateTo']);
                  }}
                />
                <RHFDatePicker
                  label="Date To"
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
                  alignItems: { xs: 'stretch', sm: 'flex-start' },
                }}
              >
                <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <RHFMultiFilteredSearchBar
                    name="filteredSearchKey"
                    filterOptions={returnSearchFilterColumnOptions()}
                    setSelectedFilters={setSelectedMultiSearchFilter}
                    selectedFilters={selectedMultiSearchFilter}
                    maxSelections={5}
                    maxSelectedDisplay={2}
                    autoSelectFirst
                    placeholder="Search across selected columns..."
                  />
                </Box>
                <Box sx={{ width: '160px' }}>
                  <RHFAutocomplete
                    name="unitType"
                    size="small"
                    label="Unit*"
                    options={['Metric', 'Imperial']}
                    disableClearable
                    autoSelect
                    openOnFocus
                  />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <StyledTooltip
                    title="Fetch Logs"
                    placement="top"
                    disableFocusListener
                    tooltipcolor={theme.palette.primary.main}
                  >
                    <StyledContainedIconButton type="submit" disabled={isSubmitting} sx={{ px: 2 }} >
                      <Iconify sx={{ height: '24px', width: '24px' }} icon={isSubmitting ? 'line-md:loading-twotone-loop' : "mdi:reload"} />
                    </StyledContainedIconButton>
                  </StyledTooltip>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <DownloadMachineLogsIconButton dataForApi={dataForApi} unit={unitType} />
                </Box>
              </Stack>
            </Stack>
          </Card>
        </form>
      </FormProvider>

      <MachineLogsDataTable allMachineLogsPage={false} dataForApi={dataForApi} logType={logType} unitType={unit} />
    </Container>
  );
}