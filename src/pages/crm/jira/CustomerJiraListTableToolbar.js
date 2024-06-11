import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
// @mui
import { Stack } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

CustomerJiraListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func
};

export default function CustomerJiraListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  filterStatus,
  onFilterStatus,
  onResetFilter,
}) {

  const navigate = useNavigate();
  const { machineId } = useParams();
  const { machine } = useSelector((state) => state.machine);

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={ isFiltered }
        value={ filterName }
        onChange={ onFilterName }
        onClick={ onResetFilter }
        filterStatus={filterStatus}
        onFilterStatus={onFilterStatus}
        transferredMachine={ machine?.status?.slug==='transferred' }
      />
    </Stack>
  );
}
