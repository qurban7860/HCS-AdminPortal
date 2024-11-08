import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// components
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
import { options } from '../../../../theme/styles/default-styles';

ApiLogsListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function ApiLogsListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}) {

  return (
    <Stack {...options} >
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
      />
    </Stack>
  );
}

