import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack, Autocomplete, TextField } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
// constants
import { BUTTONS } from '../../../constants/default-constants';
// styles
import { options } from '../../../theme/styles/default-styles';
import { resetMachineServiceReport, setFormActiveStep } from '../../../redux/slices/products/machineServiceReport';

// ----------------------------------------------------------------------

MachineServiceReportListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  isHistory: PropTypes.bool,
  toggleStatus: PropTypes.bool,
  onToggleStatus: PropTypes.func,
};

export default function MachineServiceReportListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  isHistory,
  toggleStatus,
  onToggleStatus
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { machineId } = useParams();

  const toggleAdd = async () => {
    await dispatch(resetMachineServiceReport());
    await dispatch(setFormActiveStep(0));
    await navigate(PATH_MACHINE.machines.serviceReports.new(machineId))
  };

  const { machine } = useSelector((state) => state.machine); 
  const { activeServiceReportStatuses, isLoadingReportStatus  } = useSelector( (state) => state.serviceReportStatuses );

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        node={
          <Autocomplete 
            value={ filterStatus || null}
            isLoading={ isLoadingReportStatus }
            options={ activeServiceReportStatuses }
            isOptionEqualToValue={(option, val) => option?._id === val?._id}
            getOptionLabel={(option) => option?.name}
            onChange={onFilterStatus}
            renderOption={(props, option) => ( <li {...props} key={option?._id}>{option?.name || ''}</li> )}
            renderInput={(params) => <TextField {...params} size='small' label="Status" />}
          />  
        }
        addButton={!(machine?.isArchived || isHistory) ? BUTTONS.ADD_MACHINE_SERVICE_REPORT : undefined}
        transferredMachine={machine?.status?.slug==='transferred'}
        radioStatus={toggleStatus}
        radioStatusLabel="Show Draft"
        handleRadioStatus={onToggleStatus}
      />
    </Stack>
  );
}
