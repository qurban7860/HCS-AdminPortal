import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

SignInLogListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  buttonAction: PropTypes.func,
};

export default function SignInLogListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  buttonAction,
}) {

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={buttonAction}
        addButton="Refresh Report"
        buttonIcon="mdi:reload"
      />
    </Stack>
  );
}
