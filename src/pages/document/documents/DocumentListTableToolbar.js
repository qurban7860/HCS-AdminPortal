import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from '../../../redux/store';
// components
import { PATH_DOCUMENT, PATH_CRM, PATH_MACHINE } from '../../../routes/paths';
import { 
  setDocumentFormVisibility, 
  setDocumentHistoryNewVersionFormVisibility, 
  setDocumentNewVersionFormVisibility 
} from '../../../redux/slices/document/document';
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
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
  handleGalleryView: PropTypes.func,
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
  handleGalleryView
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customerId, machineId } = useParams();
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);

  const toggleAdd = async () => {
      await  dispatch(setDocumentHistoryNewVersionFormVisibility(false));
      await  dispatch(setDocumentNewVersionFormVisibility(false));
    if(customerPage && !machinePage){
      await navigate(PATH_CRM.customers.documents.new(customer?._id))
    } else if(!customerPage && machinePage){
      await navigate(PATH_MACHINE.machines.documents.new(machineId))
    }else if(machineDrawings){
      navigate(PATH_DOCUMENT.document.machineDrawings.new)
    }
  };

  const toggleAddList = async () => navigate(PATH_DOCUMENT.document.machineDrawings.newList);

  let addButton;
  if (machineDrawings) {
    addButton = BUTTONS.ADDDRAWING;
  } else if(customerPage || machinePage){
    addButton = BUTTONS.ADDDOCUMENT;
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
        SubOnClick2={ machineDrawings && toggleAddList || undefined }
        addButton={addButton}
        transferredMachine={machinePage && machine?.status?.slug==='transferred'}
        categoryVal={categoryVal}
        setCategoryVal={(machineDrawings || machinePage) ? setCategoryVal : null }
        typeVal={typeVal}
        setTypeVal={(machineDrawings || machinePage) ? setTypeVal : null }
        handleGalleryView={handleGalleryView}
      />
    </Stack>
  );
}
