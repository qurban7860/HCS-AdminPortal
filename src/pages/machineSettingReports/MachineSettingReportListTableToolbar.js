import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// components
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// styles
import { options } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

MachineSettingReportListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  onExportCSV:PropTypes.func,
  onExportLoading:PropTypes.bool,
  isArchived: PropTypes.bool,
};

export default function MachineSettingReportListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  onResetFilter,
  onFilterStatus,
  onExportCSV,
  onExportLoading,
  isArchived,
}) {

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        onExportCSV={ !isArchived ? onExportCSV : undefined }
        onExportLoading={ onExportLoading  }
      />
    </Stack>
  );
}

