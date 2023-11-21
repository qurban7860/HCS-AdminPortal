import PropTypes from 'prop-types';
// import { sentenceCase } from 'change-case';
// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../redux/store';
// components
import Iconify from '../../../components/iconify';
import { SearchBarCombo } from '../../components/ListTableTools'
import { setNoteFormVisibility } from '../../../redux/slices/customer/customerNote';
import { BUTTONS } from '../../../constants/default-constants';

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
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  // const toggleAdd = () => dispatch(setNoteFormVisibility(true));
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
    />
  </Stack>
  );
}
