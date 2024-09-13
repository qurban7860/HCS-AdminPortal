import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import { Stack } from '@mui/material';
// routes
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { PATH_MACHINE, PATH_MACHINE_LOGS } from '../../../routes/paths';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
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
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  isHistory: PropTypes.bool,
  dateFrom: PropTypes.string,
  dateTo: PropTypes.string,
};

export default function MachineLogsListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  isHistory,
  dateFrom,
  dateTo,
}) {

  const navigate = useNavigate();
  const { machineId } = useParams();
  const { machine } = useSelector((state) => state.machine); 
  const location = useLocation();
  const toggleAdd = () => navigate(PATH_MACHINE.machines.logs.new(machineId));
  const toggleGraph = () => navigate(PATH_MACHINE.machines.logs.graph(machineId));

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={ isFiltered }
        value={ filterName }
        onChange={ onFilterName }
        onClick={ onResetFilter }
        SubOnClick={ toggleAdd }
        dateFrom={ dateFrom }
        dateTo={ dateTo }
        isDateFromDateTo
        openGraph={ location.pathname !== PATH_MACHINE_LOGS.machineLogs.LogGraphReport ? toggleGraph : undefined }
        addButton={!(machine?.isArchived || isHistory) && location.pathname !== PATH_MACHINE_LOGS.machineLogs.LogGraphReport? BUTTONS.ADD_MACHINE_LOGS : undefined}
        transferredMachine={ machine?.status?.slug==='transferred' }
      />
    </Stack>
  );
}
