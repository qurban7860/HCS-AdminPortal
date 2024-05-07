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

MachineJiraListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  isHistory: PropTypes.bool,
  dateFrom: PropTypes.string,
  dateTo: PropTypes.string,
};

export default function MachineJiraListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
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
        transferredMachine={ machine?.status?.slug==='transferred' }
      />
    </Stack>
  );
}
