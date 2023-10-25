import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack } from '@mui/material';
// routes
import { setMachineServiceRecordAddFormVisibility } from '../../../redux/slices/products/machineServiceRecord';
// components
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

MachineServiceRecordListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function MachineServiceRecordListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}) {
  const dispatch = useDispatch()

  const toggleAdd = () => {
    dispatch(setMachineServiceRecordAddFormVisibility(true))
  };

  const { machine } = useSelector((state) => state.machine);
  

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADD_MACHINE_SERVICE_RECORD}
        transferredMachine={machine?.status?.slug==='transferred'}
      />
    </Stack>
  );
}
