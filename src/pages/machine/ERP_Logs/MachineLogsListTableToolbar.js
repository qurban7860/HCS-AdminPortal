import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack } from '@mui/material';
// routes
// components
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';
import { setMachineErpLogAddFormVisibility, setMachineErpLogListViewFormVisibility } from '../../../redux/slices/products/machineErpLogs';

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
  setDateFrom: PropTypes.func,
  dateTo: PropTypes.string,
  setDateTo: PropTypes.func,
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
  setDateFrom,
  dateTo,
  setDateTo,
}) {

  const dispatch = useDispatch();
  const { machine } = useSelector((state) => state.machine);
  const toggleAdd = () => { dispatch(setMachineErpLogAddFormVisibility(true)) };
  const toggleGraph = () => { dispatch(setMachineErpLogListViewFormVisibility(false)) };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={ isFiltered }
        value={ filterName }
        onChange={ onFilterName }
        onClick={ onResetFilter }
        SubOnClick={ toggleAdd }
        dateFrom={ dateFrom }
        setDateFrom={ setDateFrom }
        dateTo={ dateTo }
        setDateTo={ setDateTo }
        openGraph={ toggleGraph }
        addButton={ !isHistory && BUTTONS.ADD_MACHINE_LOGS }
        transferredMachine={ machine?.status?.slug==='transferred' }
      />
    </Stack>
  );
}
