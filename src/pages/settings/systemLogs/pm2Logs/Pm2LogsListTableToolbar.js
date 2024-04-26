import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// components
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
import { options } from '../../../../theme/styles/default-styles';

Pm2LogsListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  isPm2Environments: PropTypes.bool,
  handleRefresh: PropTypes.func,
};

export default function Pm2LogsListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  isPm2Environments,
  handleRefresh,
}) {

  return (
    <Stack {...options} >
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        isPm2Environments
        isPm2LogTypes
        handleRefresh={handleRefresh}
      />
    </Stack>
  );
}
