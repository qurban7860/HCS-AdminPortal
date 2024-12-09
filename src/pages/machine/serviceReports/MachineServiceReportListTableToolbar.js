import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack, Autocomplete, TextField, Grid } from '@mui/material';
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
  reportsPage: PropTypes.bool,
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onReload: PropTypes.func,
  filterStatus: PropTypes.object,
  filterStatusType: PropTypes.array,
  onFilterStatus: PropTypes.func,
  onFilterStatusType: PropTypes.func,
  statusOptions: PropTypes.array,
  isHistory: PropTypes.bool,
  toggleStatus: PropTypes.bool,
  onToggleStatus: PropTypes.func,
};

export default function MachineServiceReportListTableToolbar({
  reportsPage,
  isFiltered,
  filterName,
  onReload,
  filterStatus = null ,
  filterStatusType ,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  onFilterStatusType,
  isHistory,
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
  const { activeServiceReportStatuses, isLoadingReportStatus, statusTypes  } = useSelector( (state) => state.serviceReportStatuses );

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={ onFilterName }
        onReload={ onReload }
        onClick={onResetFilter}
        SubOnClick={ !reportsPage ? toggleAdd : undefined }
        reduceFilterSize
        nodes={
          <>
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>

            <Autocomplete 
              value={ filterStatus || null}
              isloading={ isLoadingReportStatus?.toString() }
              options={ activeServiceReportStatuses?.filter( s => s?.type?.toLowerCase() !== 'draft' ) }
              isOptionEqualToValue={(option, val) => option?._id === val?._id}
              getOptionLabel={(option) => option?.name}
              onChange={onFilterStatus}
              renderOption={(props, option) => ( <li {...props} key={option?._id}>{option?.name || ''}</li> )}
              renderInput={(params) => <TextField {...params} size='small' label="Status" />}
            />  
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={ 4} >
            <Autocomplete 
              value={ filterStatusType || [] }
              multiple
              disableCloseOnSelect
              filterSelectedOptions
              size="small"
              options={ statusTypes }
              getOptionLabel={(option) => option}
              onChange={ onFilterStatusType }
              renderOption={(props, option) => ( <li {...props} key={option}>{option || ''}</li> )}
              renderInput={(params) => <TextField {...params} size='small' label="Status Type" />}
            /> 
          </Grid>
          </>
        }
        addButton={!( machine?.isArchived || isHistory ) ? BUTTONS.ADD_MACHINE_SERVICE_REPORT : undefined}
        transferredMachine={machine?.status?.slug==='transferred'}
      />
    </Stack>
  );
}
