import PropTypes from 'prop-types';
// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
import Iconify from '../../../../components/iconify';
import { PATH_DOCUMENT } from '../../../../routes/paths';
import { BUTTONS } from '../../../../constants/default-constants';
import { options } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

DocumentListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function DocumentListTableToolbar({
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
    navigate(PATH_DOCUMENT.document.new);
  };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDDOCUMENT}
      />
    </Stack>
  );
}
