import PropTypes from 'prop-types';
// import { sentenceCase } from 'change-case';
// @mui
import { Stack } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../../redux/store';
// import { PATH_DOCUMENT } from '../../../routes/paths';
import { setToolInstalledFormVisibility } from '../../../redux/slices/products/toolInstalled';
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
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleAdd = () => dispatch(setToolInstalledFormVisibility(true));
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
        addButton={BUTTONS.ADDTOOLINSTALLED}
        transferredMachine={machine?.status?.slug==='transferred'}
      />
    </Stack>
  );
}
