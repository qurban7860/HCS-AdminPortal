import PropTypes from 'prop-types';
// import { sentenceCase } from 'change-case';
// @mui
import { Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PATH_MACHINE } from '../../../routes/paths';
import { SearchBarCombo } from '../../../components/ListTableTools'
// constants
import { BUTTONS } from '../../../constants/default-constants';
// ----------------------------------------------------------------------

ToolInstalledListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function ToolInstalledListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}) {
  const { machineId } = useParams()
  const navigate = useNavigate();
  const toggleAdd = () => navigate(PATH_MACHINE.machines.toolsInstalled.new(machineId));
  const { machine } = useSelector((state) => state.machine); 
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
        SubOnClick={toggleAdd}
        addButton={!machine?.isArchived ? BUTTONS.ADDTOOLINSTALLED : undefined}
        transferredMachine={machine?.status?.slug==='transferred'}
      />
    </Stack>
  );
}
