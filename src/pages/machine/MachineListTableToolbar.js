import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @mui
import { Stack } from '@mui/material';
// Redux slices
import { resetActiveCategories } from '../../redux/slices/products/category';
import { resetActiveMachineModels } from '../../redux/slices/products/model';
import { resetActiveMachineStatuses } from '../../redux/slices/products/statuses';
import { resetActiveSuppliers } from '../../redux/slices/products/supplier';
// components
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// constants
import { BUTTONS } from '../../constants/default-constants';
// styles
import { options } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

MachineListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  onFilterVerify: PropTypes.func,
  filterVerify: PropTypes.string,
  onExportCSV:PropTypes.func,
  onExportLoading:PropTypes.bool,
  setAccountManagerFilter:PropTypes.func,
  accountManagerFilter:PropTypes.object,
  setSupportManagerFilter:PropTypes.func,
  supportManagerFilter:PropTypes.object,
};

export default function MachineListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  onFilterVerify,
  filterVerify,
  onExportCSV,
  onExportLoading,
  setAccountManagerFilter,
  accountManagerFilter,
  setSupportManagerFilter,
  supportManagerFilter,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleAdd = () => {
    navigate(PATH_MACHINE.machines.new);
    dispatch( resetActiveCategories() );
    dispatch( resetActiveMachineModels() );
    dispatch( resetActiveMachineStatuses() );
    dispatch( resetActiveSuppliers() );
  };

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        onFilterVerify={onFilterVerify}
        filterVerify={filterVerify}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDMACHINE}
        onExportCSV={onExportCSV}
        onExportLoading={onExportLoading}
        setAccountManagerFilter={setAccountManagerFilter}
        accountManagerFilter={accountManagerFilter}
        setSupportManagerFilter={setSupportManagerFilter}
        supportManagerFilter={supportManagerFilter}
      />
    </Stack>
  );
}
