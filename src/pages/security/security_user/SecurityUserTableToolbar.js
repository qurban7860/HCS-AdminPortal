import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack } from '@mui/material';
// redux
import { useDispatch } from '../../../redux/store';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
import { PATH_SECURITY } from '../../../routes/paths';
import { setSecurityUserFormVisibility } from '../../../redux/slices/securityUser/securityUser';
import { BUTTONS } from '../../../constants/default-constants';
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

SecurityUserTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onResetFilter: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
  filterListBy: PropTypes.string,
  onFilterListBy: PropTypes.func,
  employeeFilterListBy: PropTypes.string,
  onEmployeeFilterListBy: PropTypes.func,
  onReload: PropTypes.func,
};

export default function SecurityUserTableToolbar({
  isFiltered,
  filterName,
  filterRole,
  filterListBy,
  onFilterListBy,
  employeeFilterListBy,
  onEmployeeFilterListBy,
  optionsRole,
  onFilterName,
  onFilterRole,
  onResetFilter,
  onReload
}) {
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formNewVisibleToggle = () => {
    dispatch(setSecurityUserFormVisibility(true));
    navigate(PATH_SECURITY.users.new);
  };

  const formInviteVisibleToggle = () => {
    dispatch(setSecurityUserFormVisibility(true));
    navigate(PATH_SECURITY.users.invite);
  };

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={formNewVisibleToggle}
        inviteOnClick={formInviteVisibleToggle}
        filterListBy={filterListBy}
        onFilterListBy={onFilterListBy}
        employeeFilterListBy={employeeFilterListBy}
        onEmployeeFilterListBy={onEmployeeFilterListBy}
        addButton={BUTTONS.ADDUSER}
        inviteButton={BUTTONS.INVITEUSER}
        onReload={onReload}
        securityUserPage
      />
    </Stack>
  );
}
