import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// hooks
import { useNavigate } from 'react-router-dom';
// components
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

SupplierListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function SupplierListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}) {
  const navigate = useNavigate();
  const toggleAdd = () => {
    navigate(PATH_MACHINE.machines.settings.supplier.new);
  };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDSUPPLIER}
      />
    </Stack>
  );
}
