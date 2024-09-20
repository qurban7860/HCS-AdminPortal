import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import { Box, Button, Divider, Stack, Typography, useTheme } from '@mui/material';
// routes
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { PATH_MACHINE, PATH_MACHINE_LOGS } from '../../../routes/paths';
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
  archivedLogs
}) {

  const navigate = useNavigate();
  const { machineId } = useParams();
  const { machine } = useSelector((state) => state.machine); 
  const location = useLocation();
  const toggleAdd = () => navigate(PATH_MACHINE.machines.logs.new(machineId));
  const toggleGraph = () => navigate(PATH_MACHINE.machines.logs.graph(machineId));

  const theme = useTheme();

//   <Button
//   size="small"
//   startIcon={<Iconify icon="tabler:graph-off" sx={{ mr: 0.3 }} />}
//   variant="outlined"
//   sx={{ alignSelf: 'flex-end' }}
//   onClick={toggleArchivedLogs}
// >
//   Archived Logs
// </Button>

  return (
    <Stack {...options} direction="column" spacing={1} sx={{ px: 2.5, py: 3, pt: 1.5}}>
      {!archivedLogs ? null
      : (
        <Stack direction="row" spacing={1} sx={{ alignSelf: 'flex-start', alignItems: 'center' }}>
          <IconTooltip
            title='Back'
            onClick={toggleArchivedLogs}
            color={theme.palette.primary.main}
            icon="mdi:arrow-left"
          />
          <Divider orientation="vertical" flexItem />
          <Box sx={{ borderBottom: 2, borderColor: 'primary.main', pb: 1 }}>
            <Typography variant="h5" color="text.primary">Archived Logs</Typography>
          </Box>
        </Stack>
      )}
     </>
      )}
      <SearchBarCombo
        isFiltered={ isFiltered }
        value={ filterName }
        onChange={ onFilterName }
        onClick={ onResetFilter }
        logTypes={ location.pathname !== PATH_MACHINE_LOGS.root ? logTypes : undefined }
        SubOnClick={ toggleAdd }
        dateFrom={ dateFrom }
        dateTo={ dateTo }
        isDateFromDateTo
        // openGraph={ location.pathname !== PATH_MACHINE_LOGS.root ? toggleGraph : undefined }
        addButton={!(machine?.isArchived || isHistory) && location.pathname !== PATH_MACHINE_LOGS.root? BUTTONS.ADD_MACHINE_LOGS : undefined}
        transferredMachine={ machine?.status?.slug==='transferred' }
      />
    </Stack>
  );
}
