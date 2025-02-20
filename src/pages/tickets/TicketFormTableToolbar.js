import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack, TextField, Autocomplete, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
// import { PATH_SUPPORT } from '../../routes/paths';
// constants
import { getActiveTicketStatuses, resetActiveTicketStatuses } from '../../redux/slices/ticket/ticketSettings/ticketStatuses';
import { getActiveTicketIssueTypes, resetActiveTicketIssueTypes } from '../../redux/slices/ticket/ticketSettings/ticketIssueTypes'; 
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
  filterResolvedStatus: PropTypes.string, 
  onFilterResolvedStatus: PropTypes.func,
  onReload: PropTypes.func,
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
  filterResolvedStatus, 
  onFilterResolvedStatus, 
  onReload
}) {
  // const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeTicketStatuses } = useSelector((state) => state.ticketStatuses);
  const { activeTicketIssueTypes } = useSelector((state) => state.ticketIssueTypes);

  const [filteredStatusTypes, setFilteredStatusTypes] = useState([]);
  const [filteredStatuses, setFilteredStatuses] = useState([]);

  useEffect(() => {
    dispatch(getActiveTicketStatuses());
    dispatch(getActiveTicketIssueTypes());
    return () => {
      dispatch(resetActiveTicketStatuses());
      dispatch(resetActiveTicketIssueTypes());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (activeTicketStatuses) {
      if (filterResolvedStatus !== null) {
        const isResolved = filterResolvedStatus === 'resolved';
        setFilteredStatusTypes(
          activeTicketStatuses
            ?.filter(status => status.statusType.isResolved === isResolved)
            ?.map(status => status.statusType)?.filter((v, i, a) => a?.findIndex(t => t._id === v._id) === i)
        );
      } else {
        onFilterStatusType(null); 
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterResolvedStatus, activeTicketStatuses]);

  useEffect(() => {
    if (filterStatusType) {
      setFilteredStatuses(activeTicketStatuses?.filter(status => status?.statusType?._id === filterStatusType?._id));
    } else {
      setFilteredStatuses([]);
      onFilterStatus([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatusType, activeTicketStatuses]);

  // const toggleAdd = () => {
  //   navigate(PATH_SUPPORT.supportTickets.new);
  // };

  return (
    <>
    <Stack {...options}>
      <SearchBarCombo
        nodes={
          <>
              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}> 
                <Autocomplete
                  value={filterIssueType || null}
                  name="issueType"
                  options={[...activeTicketIssueTypes].sort((a, b) => a.displayOrderNo - b.displayOrderNo)} 
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => option?.name}
                  renderInput={(params) => <TextField {...params} size='small' label="Issue Type" />}
                  renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option?.name || ''}`} </li> )}
                  onChange={(event, newValue) => {
                    onFilterIssueType(newValue);
                  }}
                />
              </Grid> 
              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label" sx={{ mt:-0.7  }}>Resolved</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size='small'
                    name="isResolved"
                    value={filterResolvedStatus || null}
                    label="Resolved"
                    onChange={(event) => {
                      onFilterResolvedStatus(event.target.value);
                    }}
                  >
                    <MenuItem key="resolved" value="resolved">Resolved</MenuItem>
                    <MenuItem key="unresolved" value="unresolved">Unresolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <Autocomplete
                value={filterStatusType || null}
                name="statusType"
                options={[...filteredStatusTypes].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => option?.name}
                renderInput={(params) => <TextField {...params} size='small' label="Status Type" />}
                renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option?.name || ''}`} </li> )}
                onChange={(event, newValue) => {
                  onFilterStatusType(newValue); 
                }}
              />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={3} xl={3}>
              <Autocomplete
                value={filterStatus}
                name="status"
                size="small"
                options={[...filteredStatuses].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                multiple
                disableCloseOnSelect
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => option?.name}
                renderInput={(params) => <TextField {...params} size='small' label="Status" />}
                renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option?.name || ''}`} </li> )}
                onChange={(event, newValue) => {
                  onFilterStatus(newValue); 
                }}
              />
              </Grid>
          </>         
        }
        // SubOnClick={toggleAdd}
        // addButton={BUTTONS.ADDTICKET}
      />
    </Stack>
    <Stack {...options}  sx={{ mt: -1.5, mb: 2, ml: 2.5, mr: 2 }}>
    <SearchBarCombo
     isFiltered={isFiltered}
     value={filterName}
     onChange={onFilterName}
     onClick={onResetFilter}
     increaseFilterSize
     onReload={onReload}
   />
   </Stack>
   </>
  );
}


