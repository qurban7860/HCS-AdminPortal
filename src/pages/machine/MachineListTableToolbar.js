import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { PATH_MACHINE } from '../../routes/paths';
import SearchBarCombo from '../components/ListTableTools/SearchBarCombo';
import { BUTTONS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

MachineListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function MachineListTableToolbar({
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
    navigate(PATH_MACHINE.machines.new);
  };

  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDMACHINE}
      />
    </Stack>
  );
}
