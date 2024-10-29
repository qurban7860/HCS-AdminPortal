import PropTypes from 'prop-types';
// @mui
import { Stack, Autocomplete, TextField } from '@mui/material';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

PortalRegistrationListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.any,
  onChangeStatus: PropTypes.func,
};

export default function PortalRegistrationListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  filterStatus,
  onChangeStatus,
}) {

  return (
    <Stack {...options}>
      <SearchBarCombo
        node={
            <Autocomplete 
              value={ filterStatus || null}
              options={ [ "NEW", "APPROVED", "REJECTED", "PENDING" ] }
              onChange={(event, newValue) => {
                if (newValue) {
                  onChangeStatus(newValue);
                } else {
                  onChangeStatus(null);
                }
              }}
              renderInput={(params) => <TextField {...params} size='small' label="Status" />}
            />  
        }
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
      />
    </Stack>
  );
}
