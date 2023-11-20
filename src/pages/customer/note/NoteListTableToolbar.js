import PropTypes from 'prop-types';
// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../redux/store';
// components
import { SearchBarCombo } from '../../components/ListTableTools';
// import { PATH_DOCUMENT } from '../../../routes/paths';
import { setNoteFormVisibility } from '../../../redux/slices/customer/customerNote';
// constants
import { BUTTONS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

NoteListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function NoteListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}) {
  const dispatch = useDispatch();
  const toggleAdd = () => dispatch(setNoteFormVisibility(true));

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
      SubOnClick={toggleAdd}
      addButton={BUTTONS.ADDNOTE}
    />
  </Stack>
  );
}
