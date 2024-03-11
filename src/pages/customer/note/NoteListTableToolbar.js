import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from '../../../redux/store';
// components
import { SearchBarCombo } from '../../../components/ListTableTools';
// import { PATH_DOCUMENT } from '../../../routes/paths';
import { setNoteFormVisibility } from '../../../redux/slices/customer/customerNote';
// constants
import { BUTTONS } from '../../../constants/default-constants';
import { PATH_CUSTOMER } from '../../../routes/paths';

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
  const navigate = useNavigate();
  const { customer } = useSelector((state) => state.customer);

  const toggleAdd = () => navigate(PATH_CUSTOMER.notes.new(customer?._id));

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
