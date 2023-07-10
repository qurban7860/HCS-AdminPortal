import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// components
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// styles
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
};

export default function SignInLogListTableToolbar({
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
    navigate(PATH_DASHBOARD.role.new);
  };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        isDisabled
      />
    </Stack>
  );
}
