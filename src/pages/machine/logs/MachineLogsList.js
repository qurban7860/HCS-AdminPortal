import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import { Container, Card, Stack, Box, Typography, IconButton, MenuItem } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { yupResolver } from '@hookform/resolvers/yup';

// routes
import { useNavigate, useParams } from 'react-router-dom';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  getMachineLogRecords,
  ChangePage
} from '../../../redux/slices/products/machineErpLogs';
import MachineTabContainer from '../util/MachineTabContainer';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';
import { RHFAutocomplete, RHFDatePicker, RHFSelect } from '../../../components/hook-form';
import RHFFilteredSearchBar from '../../../components/hook-form/RHFFilteredSearchBar';
import { fetchIndMachineLogSchema } from '../../schemas/machine';
import { BUTTONS } from '../../../constants/default-constants';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import { PATH_MACHINE } from '../../../routes/paths';
import MachineLogsDataTable from './MachineLogsDataTable';

// ----------------------------------------------------------------------

MachineLogsList.propTypes = {
  allMachineLogsType: PropTypes.object
};

export default function MachineLogsList({ allMachineLogsType }) {
  const [selectedSearchFilter, setSelectedSearchFilter] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId } = useParams();

  const methods = useForm({
    defaultValues: {
      logType: machineLogTypeFormats.find(option => option.type === 'ERP') || null,
      dateFrom: new Date(new Date().setHours(0, 0, 0, 0)),
      dateTo: new Date(new Date().setHours(23, 59, 59, 999)),
      filteredSearchKey: '',
      activeStatus: 'active',
    },
    resolver: yupResolver(fetchIndMachineLogSchema),
  });

  const { watch, setValue, handleSubmit, trigger } = methods;
  const { dateFrom, dateTo, logType, filteredSearchKey, activeStatus } = watch();

  useEffect(() => {
    handleResetFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { page, rowsPerPage } = useSelector((state) => state.machineErpLogs);
  const { machine } = useSelector((state) => state.machine);

  const handleResetFilter = () => {
    setValue(filteredSearchKey, '')
    setSelectedSearchFilter('')
  };

  const dataForApi = {
    customerId: machine?.customer?._id,
    machineId,
    page,
    pageSize: rowsPerPage,
    fromDate: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
    toDate: new Date(new Date(dateTo).setHours(23, 59, 59, 999)),
    isArchived: activeStatus === 'archived',
    isMachineArchived: false,
    selectedLogType: logType?.type,
    searchKey: filteredSearchKey,
    searchColumn: selectedSearchFilter,
  };

  const onSubmit = (data) => {
    dispatch(ChangePage(0));
    dispatch(
      getMachineLogRecords({
        customerId: machine?.customer?._id,
        machineId,
        page: 0,
        pageSize: rowsPerPage,
        fromDate: new Date(new Date(dateFrom).setHours(0, 0, 0, 0)),
        toDate: new Date(new Date(dateTo).setHours(23, 59, 59, 999)),
        isArchived: activeStatus === "archived",
        isMachineArchived: machine?.isArchived,
        selectedLogType: logType.type,
        searchKey: filteredSearchKey,
        searchColumn: selectedSearchFilter,
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
          <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', mb: 3 }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignSelf: 'flex-start', alignItems: 'center' }}
                >
                  <Box sx={{ pb: 1 }}>
                    <Typography variant="h5" color="text.primary">
                      ERP Logs
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignSelf: 'flex-end' }}>
                  {showAddbutton() && (
                    <StyledTooltip
                      title={showAddbutton()}
                      placement="top"
                      disableFocusListener
                      tooltipcolor="#103996"
                      color="#fff"
                    >
                      <IconButton
                        color="#fff"
                        onClick={() => navigate(PATH_MACHINE.machines.logs.new(machineId))}
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
                  alignItems: { xs: 'stretch', sm: 'flex-start' },
                }}
              >
                <Box sx={{ flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <RHFFilteredSearchBar
                    name="filteredSearchKey"
                    filterOptions={returnSearchFilterColumnOptions()}
                    setSelectedFilter={setSelectedSearchFilter}
                    selectedFilter={selectedSearchFilter}
                    placeholder="Enter Search here..."
                    helperText={
                      selectedSearchFilter === '_id'
                        ? 'To search by ID, you must enter the complete Log ID'
                        : ''
                    }
                    fullWidth
                  />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <RHFSelect
                    name="activeStatus"
                    size="small"
                    label="Status"
                    sx={{ width: { xs: '100%', sm: 150 } }}
                    onChange={(e) => setValue('activeStatus', e.target.value)}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </RHFSelect>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                  <LoadingButton type="submit" variant="contained" size="large" fullWidth>
                    Get Logs
                  </LoadingButton>
                </Box>
              </Stack>
            </Stack>
          </Card>
        </form>
      </FormProvider>
      <MachineLogsDataTable allMachineLogsPage={false} dataForApi={dataForApi} logType={logType} />
    </Container>
  );
}

