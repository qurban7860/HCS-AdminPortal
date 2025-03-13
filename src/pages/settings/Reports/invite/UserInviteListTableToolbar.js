import PropTypes from 'prop-types';
// @mui
import { Stack, Button, TextField, Autocomplete, InputAdornment, Grid } from '@mui/material';
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
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        nodes={
          <>
            <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
              <Autocomplete
                value={filterStatus || null}
                options={['PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'REVOKED']}
                isOptionEqualToValue={(option, val) => option?._id === val?._id}
                getOptionLabel={(option) => option?.name}
                onChange={onFilterStatus}
                renderOption={(props, option) => (<li {...props} key={option?._id}>{option?.name || ''}</li>)}
                renderInput={(params) => <TextField {...params} size='small' label="Status" />}
              />
            </Grid>
          </>
        }
      />
    </Stack>
  );
}
