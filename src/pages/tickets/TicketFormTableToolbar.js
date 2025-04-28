import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack, TextField, Autocomplete, Grid } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
// import { PATH_SUPPORT } from '../../routes/paths';
// constants
import { getActiveTicketStatuses, resetActiveTicketStatuses } from '../../redux/slices/ticket/ticketSettings/ticketStatuses';
import { getActiveTicketIssueTypes, resetActiveTicketIssueTypes } from '../../redux/slices/ticket/ticketSettings/ticketIssueTypes';
import { getActiveTicketRequestTypes, resetActiveTicketRequestTypes } from '../../redux/slices/ticket/ticketSettings/ticketRequestTypes';
import { getTicketPriorities, resetTicketPriorities} from'../../redux/slices/ticket/ticketSettings/ticketPriorities';
// import { BUTTONS } from '../../constants/default-constants';
import { options } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

TicketFormTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  filterStatusType: PropTypes.object,
  onFilterStatus: PropTypes.func,
  onFilterStatusType: PropTypes.func,
  filterIssueType: PropTypes.object,
  onFilterIssueType: PropTypes.func,
  filterRequestType: PropTypes.object,
  onFilterRequestType: PropTypes.func,
  filterResolvedStatus: PropTypes.string,
  onFilterResolvedStatus: PropTypes.func,
  onReload: PropTypes.func,
  filterPriority: PropTypes.object,
  onFilterPriority: PropTypes.func,
};

export default function TicketFormTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  filterStatus = [],
  filterStatusType,
  onFilterStatus,
  onFilterStatusType,
  filterIssueType,
  onFilterIssueType,
  filterRequestType,
  onFilterRequestType,
  filterResolvedStatus,
  onFilterResolvedStatus,
  onReload,
  filterPriority,
  onFilterPriority

}) {
  const dispatch = useDispatch();

  const { activeTicketStatuses } = useSelector((state) => state.ticketStatuses);
  const { activeTicketIssueTypes } = useSelector((state) => state.ticketIssueTypes);
  const { activeTicketRequestTypes } = useSelector((state) => state.ticketRequestTypes);
  const [filteredRequestTypes, setFilteredRequestTypes] = useState([]);
  const [filteredStatusTypes, setFilteredStatusTypes] = useState([]);
  const [filteredStatuses, setFilteredStatuses] = useState([]);
  const { ticketPriorities }= useSelector((state)=> state.ticketPriorities);
  const [resolvedOptions] = useState([
    { value: 'resolved', label: 'Resolved / Closed' },
    { value: 'unresolved', label: 'Unresolved / Open' },
  ]);

  useEffect(() => {
    dispatch(getActiveTicketStatuses());
    dispatch(getActiveTicketIssueTypes());
    dispatch(getActiveTicketRequestTypes());
    dispatch(getTicketPriorities());
    return () => {
      dispatch(resetActiveTicketStatuses());
      dispatch(resetActiveTicketIssueTypes());
      dispatch(resetActiveTicketRequestTypes());
      dispatch(resetTicketPriorities());
    };
  }, [dispatch]);

  useEffect(() => {
    if (filterIssueType && activeTicketRequestTypes) {
      const newFilteredRequestTypes = activeTicketRequestTypes.filter(requestType => requestType.issueType?._id === filterIssueType?._id);
      setFilteredRequestTypes(newFilteredRequestTypes);
      if (filterRequestType && !newFilteredRequestTypes.some(rt => rt._id === filterRequestType._id)) {
        onFilterRequestType(null);
      }
    } else {
      setFilteredRequestTypes([]);
      onFilterRequestType(null);
    }
  }, [filterIssueType, activeTicketRequestTypes, onFilterRequestType, filterRequestType]);

  useEffect(() => {
    if (activeTicketStatuses) {
      if (filterResolvedStatus !== null) {
        const isResolved = filterResolvedStatus === 'resolved';
        setFilteredStatusTypes(
          activeTicketStatuses
            ?.filter(status => status.statusType.isResolved === isResolved)
            ?.map(status => status.statusType)?.filter((v, i, a) => a?.findIndex(t => t._id === v._id) === i)
        );
      }
      setFilteredStatuses([]);
      onFilterStatus([]);
      onFilterStatusType(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterResolvedStatus, activeTicketStatuses]);

  useEffect(() => {
    if (filterStatusType) {
      const newFilteredStatuses = activeTicketStatuses?.filter(status => status?.statusType?._id === filterStatusType?._id);
      setFilteredStatuses(newFilteredStatuses);
      onFilterStatus(filterStatus.filter(selectedStatus => newFilteredStatuses.some(fs => fs._id === selectedStatus._id)));
    } else {
      setFilteredStatuses([]);
      onFilterStatus([]);
    }
  }, [filterStatusType, activeTicketStatuses, onFilterStatus, filterStatus]);

  return (
      <Stack {...options}>
        <SearchBarCombo
         isFiltered={isFiltered}
         value={filterName}
         onChange={onFilterName}
         onClick={onResetFilter}
          nodes={
            <>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <Autocomplete
                  value={filterIssueType || null}
                  name="issueType"
                  options={[...activeTicketIssueTypes].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => option?.name}
                  renderInput={(params) => <TextField {...params} size='small' label="Issue Type" />}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {`${option?.name || ''}`} </li>)}
                  onChange={(event, newValue) => {
                    onFilterIssueType(newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3} >
                <Autocomplete
                  value={filterRequestType || null}
                  name="requestType"
                  options={[...filteredRequestTypes].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => option?.name}
                  renderInput={(params) => <TextField {...params} size='small' label="Request Type" />}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {`${option?.name || ''}`} </li>)}
                  onChange={(event, newValue) => {
                    onFilterRequestType(newValue);
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <Autocomplete
                  value={resolvedOptions.find(option => option.value === filterResolvedStatus) || null}
                  name="isResolved"
                  options={resolvedOptions}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => <TextField {...params} size='small' label="Resolved" />}
                  onChange={(event, newValue) => {
                    onFilterResolvedStatus(newValue ? newValue.value : null);
                  }}
                  renderOption={(props, option) => (<li {...props} key={option.value}> {`${option.label}`} </li>)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3} >
                <Autocomplete
                  value={filterStatusType || null}
                  name="statusType"
                  options={[...filteredStatusTypes].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => option?.name}
                  renderInput={(params) => <TextField {...params} size='small' label="Status Type" />}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {`${option?.name || ''}`} </li>)}
                  onChange={(event, newValue) => {
                    onFilterStatusType(newValue);
                  }}
                />
              </Grid>
                       
                <Grid item xs={12} sm={6} md={6} lg={2}>
                  <Autocomplete
                    value={filterStatus}
                    name="status"
                    size="small"
                    options={[...filteredStatuses].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option?.name}
                    renderInput={(params) => <TextField {...params} size='small' label="Status" />}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {`${option?.name || ''}`} </li>)}
                    onChange={(event, newValue) => {
                      onFilterStatus(newValue);
                    }}
                  />
                </Grid>

                <Grid item xs={1} sm={1} md={1} lg={2}>
                  <Autocomplete
                    value={filterPriority || null}
                    name="priorities"
                    options={[...ticketPriorities].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option?.name}
                    renderInput={(params) => <TextField {...params} size='small' label="Priority" />}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {`${option?.name || ''}`} </li>)}
                    onChange={(event, newValue) => {
                    onFilterPriority(newValue);
                    }}
                  />
                </Grid>
              

            </>
           
          }
          onReload={onReload}
        />
      </Stack>
  );
}


