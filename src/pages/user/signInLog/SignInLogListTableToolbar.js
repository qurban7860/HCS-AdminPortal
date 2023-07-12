import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import {
  Stack,
  Button,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Grid,
  Box,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// components
import Iconify from '../../../components/iconify';
// import { PATH_DASHBOARD } from '../../../routes/paths';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
import useResponsive from '../../../hooks/useResponsive';
import { PATH_CUSTOMER, PATH_DASHBOARD } from '../../../routes/paths';
import { BUTTONS, DIALOGS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

SignInLogListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  buttonAction: PropTypes.func,
};

export default function SignInLogListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  buttonAction
}) {
  const navigate = useNavigate();
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
        SubOnClick={buttonAction}
        addButton='Refresh Report'
        buttonIcon='mdi:reload'
      />
    </Stack>
  );
}
