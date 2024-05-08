import PropTypes from 'prop-types';
// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';


UserInviteListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function UserInviteListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus
}) {

  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ px: 2.5, py: 3 }}
    >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={12} sx={{ display: 'inline-flex' }}>
          <TextField
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {' '}
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />{' '}
                </InputAdornment>
              ),
            }}
          />
          {isFiltered && (
            <Button
              color="error"
              sx={{ flexShrink: 0, ml: 1 }}
              onClick={onResetFilter}
              startIcon={<Iconify icon="eva:trash-2-outline" />}
            >
              Clear
            </Button>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}
