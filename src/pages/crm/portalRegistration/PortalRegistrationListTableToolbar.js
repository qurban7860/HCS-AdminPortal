import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

PortalRegistrationListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.any,
  onFilterStatus: PropTypes.func,
};

export default function PortalRegistrationListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  filterStatus,
  onFilterStatus,
}) {

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        filterStatus={filterStatus}
        onFilterStatus={onFilterStatus}
      />
    </Stack>
  );
}
