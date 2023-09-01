import PropTypes from 'prop-types';
import { Link as  useNavigate } from 'react-router-dom';
// @mui
import { Stack } from '@mui/material';
// redux
// import { useDispatch } from '../../redux/store';
// components
import SearchBarCombo from '../components/ListTableTools/SearchBarCombo';
// import Iconify from '../../components/iconify';
import { PATH_SETTING } from '../../routes/paths';
import { BUTTONS } from '../../constants/default-constants';
import { options } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

ModuleListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onResetFilter: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
};

export default function ModuleListTableToolbar({
  isFiltered,
  filterName,
  filterRole,
  optionsRole,
  onFilterName,
  onFilterRole,
  onResetFilter,
}) {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const linkTo = () => {
    navigate(PATH_SETTING.modules.new);
  };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={linkTo}
        addButton={BUTTONS.ADDMODULE}
      />
    </Stack>
  );
}