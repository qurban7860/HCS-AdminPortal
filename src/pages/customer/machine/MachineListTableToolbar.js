import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// components
import { SearchBarCombo } from '../../components/ListTableTools'

// ----------------------------------------------------------------------

MachineListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  transferStatus: PropTypes.bool,
  handleTransferStatus: PropTypes.func,
};

export default function MachineListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  transferStatus,
  handleTransferStatus
}) {
  
  return (
    <Stack
    spacing={2}
    alignItems="center"
    direction={{ xs: 'column', md: 'row' }}
    sx={{ px: 2.5, py: 3 }}
  >
    <SearchBarCombo
      isFiltered={isFiltered}
      value={filterName}
      onChange={onFilterName}
      onClick={onResetFilter}
      handleTransferStatus={handleTransferStatus}
      transferStatus={transferStatus}
    />
  </Stack>
  );
}
