import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack } from '@mui/material';
// redux
import { useDispatch } from '../../redux/store';
// components
import SearchBarCombo from '../components/ListTableTools/SearchBarCombo';
import { PATH_SETTING } from '../../routes/paths';
import { setRegionAddFormVisibility } from '../../redux/slices/region/region';
import { BUTTONS } from '../../constants/default-constants';
import { options } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

RegionTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onResetFilter: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
};

export default function RegionTableToolbar({
  isFiltered,
  filterName,
  filterRole,
  optionsRole,
  onFilterName,
  onFilterRole,
  onResetFilter,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formVisibleToggle = () => {
    dispatch(setRegionAddFormVisibility(true));
    navigate(PATH_SETTING.regions.new);
  };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={formVisibleToggle}
        addButton={BUTTONS.ADDREGION}
      />
    </Stack>
  );
}
