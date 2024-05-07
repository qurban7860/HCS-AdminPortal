import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  Button,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
import { options } from '../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

EmailListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function EmailListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
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
