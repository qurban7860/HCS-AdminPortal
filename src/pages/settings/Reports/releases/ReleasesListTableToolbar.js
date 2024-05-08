import PropTypes from 'prop-types';
// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import { SearchBarCombo } from '../../../../components/ListTableTools';
// styles
import { options } from '../../../../theme/styles/default-styles';


ReleasesListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function ReleasesListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus
}) {

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
      />
    </Stack>
  );
}
