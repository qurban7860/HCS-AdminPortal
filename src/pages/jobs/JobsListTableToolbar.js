import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SUPPORT } from '../../routes/paths';
// constants
import { options } from '../../theme/styles/default-styles';
// ----------------------------------------------------------------------

JobsListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function JobsListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
}) {
  const navigate = useNavigate();
  const toggleAdd = () => navigate(PATH_SUPPORT.ticketSettings.Jobs.new);
  
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton='New Issue Type'
      />
    </Stack>
  );
}
