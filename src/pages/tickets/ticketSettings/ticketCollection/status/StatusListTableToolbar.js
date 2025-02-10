import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../../../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SUPPORT } from '../../../../../routes/paths';
// constants
import { options } from '../../../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

StatusListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function StatusListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
}) {
  const navigate = useNavigate();
  const toggleAdd = () => navigate(PATH_SUPPORT.ticketSettings.statuses.new);
  
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton='New Status'
      />
    </Stack>
  );
}
