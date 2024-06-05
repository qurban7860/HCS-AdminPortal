import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack } from '@mui/material';
// components
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
import { BUTTONS } from '../../constants/default-constants';
import { options } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

JiraTableToolbar.propTypes = {
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  isFiltered: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onReload: PropTypes.func,
};

export default function JiraTableToolbar({
  filterName,
  onFilterName,
  filterStatus,
  onFilterStatus,
  isFiltered,
  onResetFilter,
  onReload
}) {
  
  // const navigate = useNavigate();
  // const dispatch = useDispatch();

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        filterStatus={filterStatus}
        onFilterStatus={onFilterStatus}
        onClick={onResetFilter}
        onReload={onReload}
      />
    </Stack>
  );
}
