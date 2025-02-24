import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { SearchBarCombo } from '../../../components/ListTableTools';
// constants
import { BUTTONS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

DrawingListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  drawing: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  categoryVal: PropTypes.object,
  setCategoryVal: PropTypes.func,
  typeVal: PropTypes.object,
  setTypeVal: PropTypes.func,
};

export default function DrawingListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  categoryVal,
  setCategoryVal,
  typeVal,
  setTypeVal,
  drawing
}) {

  const navigate = useNavigate();
  const { machineId } = useParams();

  const { machine } = useSelector((state) => state.machine); 

  const handleAattach = () => navigate(PATH_MACHINE.machines.drawings.attach(machineId));
  const handleAdd = () => navigate(PATH_MACHINE.machines.drawings.new(machineId));
  const handleAddList = () => navigate(PATH_MACHINE.machines.drawings.multipleNew(machineId));

  return (
    <Stack
    spacing={2}
    alignItems="center"
    direction={{ xs: 'column', md: 'row' }}
    sx={{ px: 2.5, py: 3 }}
    >
    <SearchBarCombo
      drawing={drawing}
      isFiltered={isFiltered}
      value={filterName}
      onChange={onFilterName}
      onClick={onResetFilter}
      SubOnClick={ !machine?.isArchived ? handleAdd : undefined }
      SubOnClick2={ !machine?.isArchived ? handleAddList : undefined }
      addButton={!machine?.isArchived ? BUTTONS.ADDDRAWING : undefined}
      handleAttach={ !machine?.isArchived ? handleAattach : undefined}
      transferredMachine={machine?.status?.slug==='transferred'}
      categoryVal={categoryVal}
      setCategoryVal={setCategoryVal}
      typeVal={typeVal}
      setTypeVal={setTypeVal}
    />
  </Stack>
  )
}
