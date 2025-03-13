import PropTypes from 'prop-types';
// @mui
import { Stack, Button, TextField, InputAdornment, Grid } from '@mui/material';
// components
import Iconify from '../../../../components/iconify';
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
import { options } from '../../../../theme/styles/default-styles';

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
      <Grid container >
        <Grid item xs={12} sm={12} sx={{ display: 'inline-flex' }}>
          <TextField
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search..."
            size='small'
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
