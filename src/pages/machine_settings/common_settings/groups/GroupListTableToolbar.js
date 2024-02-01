import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// components
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// constants
import { BUTTONS } from '../../../../constants/default-constants';
import { options } from '../../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

GroupListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function GroupListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
}) {
  const navigate = useNavigate();
  const toggleAdd = () => {
    navigate(PATH_MACHINE.machines.settings.categoryGroups.new);
  };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDCATEGORY}
        machineSettingPage
      />
    </Stack>
  );
}
