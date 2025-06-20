import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { Stack, Grid, Autocomplete, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SearchBarCombo from '../../../../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SUPPORT } from '../../../../../routes/paths';
// constants
import { options } from '../../../../../theme/styles/default-styles';
import { getActiveTicketIssueTypes, resetActiveTicketIssueTypes } from '../../../../../redux/slices/ticket/ticketSettings/ticketIssueTypes'; 
// ----------------------------------------------------------------------

RequestTypeListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterIssueType: PropTypes.array, 
  onFilterIssueType: PropTypes.func,
};

export default function RequestTypeListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  filterIssueType, 
  onFilterIssueType, 
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleAdd = () => navigate(PATH_SUPPORT.settings.requestTypes.new);
  const { activeTicketIssueTypes } = useSelector((state) => state.ticketIssueTypes); 
  
  useEffect(() => {
    dispatch(getActiveTicketIssueTypes());
    return () => {
      dispatch(resetActiveTicketIssueTypes());
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
        }
        SubOnClick={toggleAdd}
        addButton='New Request Type'
      />
    </Stack>
  );
}
