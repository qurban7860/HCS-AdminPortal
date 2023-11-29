import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import { Stack } from '@mui/material';
// routes
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// constants
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

HistoricalConfigurationsListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  isHistory: PropTypes.bool,
};

export default function HistoricalConfigurationsListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  isHistory
}) {
 
  const { machine } = useSelector((state) => state.machine);
 
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        transferredMachine={machine?.status?.slug==='transferred'}
      />
    </Stack>
  );
}
