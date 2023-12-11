import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../../redux/store';
// components
import { PATH_DOCUMENT } from '../../../routes/paths';
import { setDocumentFormVisibility, setDocumentHistoryNewVersionFormVisibility, setDocumentNewVersionFormVisibility } from '../../../redux/slices/document/document';
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
  categoryVal: PropTypes.object,
  setCategoryVal: PropTypes.func,
  typeVal: PropTypes.object,
  setTypeVal: PropTypes.func,
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
  categoryVal,
  setCategoryVal,
  typeVal,
  setTypeVal,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleAdd = async () => {
      await  dispatch(setDocumentHistoryNewVersionFormVisibility(false));
      await  dispatch(setDocumentNewVersionFormVisibility(false));
    if(customerPage || machinePage){
      await dispatch(setDocumentFormVisibility(true));
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
        addButton={addButton}
        transferredMachine={machine?.status?.slug==='transferred'}
        categoryVal={categoryVal}
        setCategoryVal={(machineDrawings || machinePage) ? setCategoryVal : null }
        typeVal={typeVal}
        setTypeVal={(machineDrawings || machinePage) ? setTypeVal : null }
      />
    </Stack>
  );
}
