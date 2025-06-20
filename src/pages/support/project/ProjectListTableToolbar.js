import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PATH_SUPPORT } from '../../../routes/paths';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

ProjectListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  isArchived: PropTypes.bool,
};

export default function ProjectListTableToolbar({
  isFiltered,
  filterName,
  onResetFilter,
  onFilterName,
  isArchived,
}) {

  const navigate = useNavigate();
  const toggleAdd = () => {
    navigate(PATH_SUPPORT.projects.new);
  };

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        {...(!isArchived && {addButton: 'Add Project'})}
        {...(!isArchived && {SubOnClick: toggleAdd})}
        settingPage
        />
    </Stack>
  );
}
