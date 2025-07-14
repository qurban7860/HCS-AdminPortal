import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// components
import { SearchBarCombo } from '../../../../components/ListTableTools'

// ----------------------------------------------------------------------

CustomerContactListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onExportCSV: PropTypes.func,
  onExportLoading: PropTypes.bool,
  isArchived: PropTypes.bool,
};

export default function CustomerContactListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  onExportCSV,
  onExportLoading,
  isArchived
}) {


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
        // onExportCSV={onExportCSV}
        {...(!isArchived && {onExportCSV})}
        onExportLoading={onExportLoading}
      />
    </Stack>
  );
}
