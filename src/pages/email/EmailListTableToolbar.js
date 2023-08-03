import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  Button,
  TextField,
  InputAdornment,
  Grid,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// components
import Iconify from '../../components/iconify';
import { PATH_DASHBOARD } from '../../routes/paths';
// ----------------------------------------------------------------------

EmailListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default function EmailListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
}) {
  const navigate = useNavigate();
  const toggleAdd = () => { navigate(PATH_DASHBOARD.email.new); };    
  return (
    <Stack spacing={2} alignItems="center" direction={{ xs: 'column', md: 'row', }} sx={{ px: 2.5, py: 3 }} >
      
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={9} sx={{display: 'inline-flex',}}>
          <TextField fullWidth value={filterName} onChange={onFilterName} placeholder="Search..." InputProps={{ startAdornment: (
            <InputAdornment position="start"> <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} /> </InputAdornment> ), }} />
          {isFiltered && (
            <Button color="error" sx={{ flexShrink: 0, ml:1}} onClick={onResetFilter} startIcon={<Iconify icon="eva:trash-2-outline" />} > Clear </Button>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}
