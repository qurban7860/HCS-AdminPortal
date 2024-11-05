import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// constants
import { BUTTONS } from '../../../constants/default-constants';
import { options } from '../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

ServiceReportTemplateListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  filterListBy: PropTypes.string,
  onFilterListBy: PropTypes.func,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function ServiceReportTemplateListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  filterListBy,
  onFilterListBy,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}) {
  const navigate = useNavigate();
  const toggleAdd = () => navigate(PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.new);

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        filterListBy={filterListBy}
        onFilterListBy={onFilterListBy}
        addButton={BUTTONS.ADD_MACHINE_SERVICE_CONFIG}
        machineSettingPage
      />
    </Stack>
  );
}
