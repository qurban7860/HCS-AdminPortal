import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// @mui
import { Stack, TextField, Autocomplete, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../../../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SUPPORT } from '../../../../../routes/paths';
// constants
import { options } from '../../../../../theme/styles/default-styles';
import { getActiveTicketStatusTypes, resetActiveTicketStatusTypes } from '../../../../../redux/slices/ticket/ticketSettings/ticketStatusTypes';
// ----------------------------------------------------------------------

StatusListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatusType: PropTypes.array,
  onFilterStatusType: PropTypes.func,
  filterResolvedStatus: PropTypes.string, 
  onFilterResolvedStatus: PropTypes.func,
};

export default function StatusListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  filterStatusType,
  onFilterStatusType,
  filterResolvedStatus, 
  onFilterResolvedStatus, 
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleAdd = () => navigate(PATH_SUPPORT.settings.statuses.new);
  const { activeTicketStatusTypes } = useSelector((state) => state.ticketStatusTypes);

  useEffect(() => {
    dispatch(getActiveTicketStatusTypes());
    return () => {
      dispatch(resetActiveTicketStatusTypes());
    };
  }, [dispatch]);

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        nodes={
          <>
           <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
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
          <Grid item xs={12} sm={6} md={4} lg={4} xl={2}>
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
          </>
        }
        SubOnClick={toggleAdd}
        addButton='New Status'
      />
    </Stack>
  );
}
