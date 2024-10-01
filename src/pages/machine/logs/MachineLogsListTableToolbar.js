import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
import Iconify from '../../../components/iconify';
import IconTooltip from '../../../components/Icons/IconTooltip';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

MachineLogsListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  statusOptions: PropTypes.array,
  isHistory: PropTypes.bool,
  dateFrom: PropTypes.string,
  dateTo: PropTypes.string,
  logTypes: PropTypes.array,
  toggleArchivedLogs: PropTypes.func,
  archivedLogs: PropTypes.bool,
  allMachineLogsPage: PropTypes.bool,
};

export default function MachineLogsListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  statusOptions,
  onResetFilter,
  isHistory,
  dateFrom,
  dateTo,
  logTypes,
  toggleArchivedLogs,
  archivedLogs,
  allMachineLogsPage = false,
}) {
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { machine } = useSelector((state) => state.machine);
  const toggleAdd = () => navigate(PATH_MACHINE.machines.logs.new(machineId));
  const toggleGraph = () => navigate(PATH_MACHINE.machines.logs.graph(machineId));

  const showAddbutton = () => {
    if (allMachineLogsPage) return false;
    if (machine?.isArchived || isHistory || archivedLogs) return false;
    return BUTTONS.ADD_MACHINE_LOGS;
  };

  const showArchiveButton = () => {
    if (allMachineLogsPage) return false;
    if (archivedLogs) return false;
    return true;
  };

  const showArchiveLogsHeader = () => {
    if (allMachineLogsPage) return false;
    if (!archivedLogs) return false;
    return true;
  };

  const theme = useTheme();

  return (
    <Stack {...options} direction="column" spacing={1} sx={{ px: 2.5, py: 3, pt: 1.5 }}>
      {showArchiveButton() ? (
        <Button
          size="small"
          startIcon={<Iconify icon="tabler:graph-off" sx={{ mr: 0.3 }} />}
          variant="outlined"
          sx={{ alignSelf: 'flex-end' }}
          onClick={toggleArchivedLogs}
        >
          Archived Logs
        </Button>
      ) : null}
      {showArchiveLogsHeader() ? (
        <Stack direction="row" spacing={1} sx={{ alignSelf: 'flex-start', alignItems: 'center' }}>
          <IconTooltip
            title="Back"
            onClick={toggleArchivedLogs}
            color={theme.palette.primary.main}
            icon="mdi:arrow-left"
          />
          <Divider orientation="vertical" flexItem />
          <Box sx={{ borderBottom: 2, borderColor: 'primary.main', pb: 1 }}>
            <Typography variant="h5" color="text.primary">
              Archived Logs
            </Typography>
          </Box>
        </Stack>
      ) : null}
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        logTypes={!allMachineLogsPage ? logTypes : undefined}
        SubOnClick={toggleAdd}
        dateFrom={dateFrom}
        dateTo={dateTo}
        isDateFromDateTo={!allMachineLogsPage}
        // openGraph={ location.pathname !== PATH_MACHINE_LOGS.root ? toggleGraph : undefined }
        addButton={showAddbutton()}
        transferredMachine={machine?.status?.slug === 'transferred'}
      />
    </Stack>
  );
}
