import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack } from '@mui/material';
// components
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
import { PATH_CRM } from '../../../../routes/paths';
import { BUTTONS } from '../../../../constants/default-constants';
import { options } from '../../../../theme/styles/default-styles';
// ----------------------------------------------------------------------

CustomerListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  onFilterVerify:PropTypes.func,
  filterVerify:PropTypes.string,
  onExportCSV:PropTypes.func,
  onExportLoading:PropTypes.bool,
  filterExcludeRepoting:PropTypes.string,
  handleExcludeRepoting:PropTypes.func
};

export default function CustomerListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  onFilterVerify,
  filterVerify,
  onExportCSV,
  onExportLoading,
  filterExcludeRepoting,
  handleExcludeRepoting
}) {
  const navigate = useNavigate();
  const toggleAdd = () => {
    navigate(PATH_CRM.customers.new);
  };

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        onFilterVerify={onFilterVerify}
        filterVerify={filterVerify}
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDCUSTOMER}
        onExportCSV={onExportCSV}
        onExportLoading={onExportLoading}
        filterExcludeRepoting={filterExcludeRepoting}
        handleExcludeRepoting={handleExcludeRepoting}
      />
    </Stack>
  );
}
