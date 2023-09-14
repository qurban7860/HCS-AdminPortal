import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '../../../redux/store';
// components
import { PATH_DOCUMENT } from '../../../routes/paths';
import { setDocumentFormVisibility } from '../../../redux/slices/document/document';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
import { BUTTONS } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

DocumentListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
};

export default function DocumentListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  customerPage,
  machinePage,
  machineDrawings,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleAdd = () => {
    if(customerPage || machinePage){
      dispatch(setDocumentFormVisibility(true));
    }else if(machineDrawings){
      navigate(PATH_DOCUMENT.document.machineDrawings.new)
    }
  };

  let addButton;
  if (machineDrawings) {
    addButton = machineDrawings ? BUTTONS.ADDDRAWING : undefined;
  } else if(customerPage || machinePage){
    addButton = customerPage || machinePage  ? BUTTONS.ADDDOCUMENT : undefined;
  }else{
    addButton = undefined;
  }
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
        addButton={addButton}
      />
    </Stack>
  );
}
