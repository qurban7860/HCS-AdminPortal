import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack, TextField, Autocomplete, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SUPPORT } from '../../routes/paths';
// constants
import { getActiveTicketStatuses, resetActiveTicketStatuses } from '../../redux/slices/ticket/ticketSettings/ticketStatuses';
import { getActiveTicketStatusTypes, resetActiveTicketStatusTypes } from '../../redux/slices/ticket/ticketSettings/ticketStatusTypes';
import { getActiveTicketIssueTypes, resetActiveTicketIssueTypes } from '../../redux/slices/ticket/ticketSettings/ticketIssueTypes'; 
// import { BUTTONS } from '../../constants/default-constants';
import { options } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

TicketFormTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.object,
  filterStatusType: PropTypes.array,
  onFilterStatus: PropTypes.func,
  onFilterStatusType: PropTypes.func,
  filterIssueType: PropTypes.array, 
  onFilterIssueType: PropTypes.func,
  filterResolvedStatus: PropTypes.string, 
  onFilterResolvedStatus: PropTypes.func,
};

export default function TicketFormTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  filterStatus = null,
  filterStatusType,
  onFilterStatus,
  onFilterStatusType,
  filterIssueType, 
  onFilterIssueType, 
  filterResolvedStatus, 
  onFilterResolvedStatus, 
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeTicketStatuses } = useSelector((state) => state.ticketStatuses);
  const { activeTicketStatusTypes } = useSelector((state) => state.ticketStatusTypes);
  const { activeTicketIssueTypes } = useSelector((state) => state.ticketIssueTypes); 

  useEffect(() => {
    dispatch(getActiveTicketStatuses());
    dispatch(getActiveTicketStatusTypes());
    dispatch(getActiveTicketIssueTypes());
    return () => {
      dispatch(resetActiveTicketStatuses());
      dispatch(resetActiveTicketStatusTypes());
      dispatch(resetActiveTicketIssueTypes());
    };
  }, [dispatch]);

  // const toggleAdd = () => {
  //   navigate(PATH_SUPPORT.supportTickets.new);
  // };

  return (
    <>
    <Stack {...options}>
      <SearchBarCombo
        nodes={
          <>
              <Grid item xs={12} sm={6} md={4} lg={2}> 
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
              <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Resolved</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size='small'
                    name="isResolved"
                    value={filterResolvedStatus || 'all'}
                    label="Resolved"
                    onChange={(event) => {
                      onFilterResolvedStatus(event.target.value);
                    }}
                  >
                    <MenuItem key="all" value="all">All</MenuItem>
                    <MenuItem key="resolved" value="resolved">Resolved</MenuItem>
                    <MenuItem key="unresolved" value="unresolved">Unresolved</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
              <Autocomplete
                value={filterStatusType || null}
                name="statusType"
                options={[...activeTicketStatusTypes].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => option?.name}
                renderInput={(params) => <TextField {...params} size='small' label="Status Type" />}
                renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option?.name || ''}`} </li> )}
                onChange={(event, newValue) => {
                  if (newValue) {
                    onFilterStatusType(newValue);
                  } else {
                    onFilterStatusType(null);
                  }
                }}
              />
              </Grid>
              <Grid item xs={12} sm={6} md={3} >
              <Autocomplete
                value={filterStatus || []}
                name="status"
                size="small"
                options={[...activeTicketStatuses].sort((a, b) => a.displayOrderNo - b.displayOrderNo)}
                multiple
                disableCloseOnSelect
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => option?.name}
                renderInput={(params) => <TextField {...params} size='small' label="Status" />}
                renderOption={(props, option) => ( <li {...props} key={option?._id}> {`${option?.name || ''}`} </li> )}
                onChange={(event, newValue) => {
                  if (newValue) {
                    onFilterStatus(newValue);
                  } else {
                    onFilterStatus(null);
                  }
                }}
              />
              </Grid>
          </>         
        }
        // SubOnClick={toggleAdd}
        // addButton={BUTTONS.ADDTICKET}
      />
    </Stack>
    <Stack {...options}  sx={{ mt: -2.5, mb: 2, ml: 2.5, mr: 2 }}>
    <SearchBarCombo
     isFiltered={isFiltered}
     value={filterName}
     onChange={onFilterName}
     onClick={onResetFilter}
    //  reduceFilterSize
   />
   </Stack>
   </>
  );
}


