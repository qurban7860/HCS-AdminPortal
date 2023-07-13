import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// hooks
import { useNavigate } from 'react-router-dom';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// components
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

DocumentCategoryListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function DocumentCategoryListTableToolbar({
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
    navigate(PATH_SETTING.documentCategory.new);
  };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDDOCUMENT_CATEGORY}
      />
    </Stack>
  );
}
