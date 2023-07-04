import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// components
import SearchBarCombo from '../components/ListTableTools/SearchBarCombo';
import Iconify from '../../components/iconify';
import useResponsive from '../../hooks/useResponsive';
import { PATH_CUSTOMER, PATH_DASHBOARD } from '../../routes/paths';
import { BUTTONS, DIALOGS } from '../../constants/default-constants';
// ----------------------------------------------------------------------

CustomerListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function CustomerListTableToolbar({
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
    navigate(PATH_CUSTOMER.new);
  };
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
        addButton={BUTTONS.ADDCUSTOMER}
      />
    </Stack>
  );
}
