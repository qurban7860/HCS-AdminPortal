import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
import { RHFAutocomplete } from '../../components/hook-form';
// routes
import { PATH_SUPPORT } from '../../routes/paths';
// constants
import { getTicketIssueTypes, resetTicketIssueTypes } from '../../redux/slices/ticket/ticketSettings/ticketIssueTypes';
import { getTicketStatuses, resetTicketStatuses } from '../../redux/slices/ticket/ticketSettings/ticketStatuses';
import { BUTTONS } from '../../constants/default-constants';
import { options } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

TicketFormTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  selectedStatus: PropTypes.object,
  setSelectedStatus: PropTypes.func,
  selectedIssueType: PropTypes.object,
  setSelectedIssueType: PropTypes.func,
};

export default function TicketFormTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  selectedStatus,
  setSelectedStatus,
  selectedIssueType,
  setSelectedIssueType,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ticketIssueTypes } = useSelector((state) => state.ticketIssueTypes);
  const { ticketStatuses } = useSelector((state) => state.ticketStatuses);

  useEffect(() => {
    dispatch(getTicketIssueTypes());
    dispatch(getTicketStatuses());
    return () => {
      dispatch(resetTicketIssueTypes());
      dispatch(resetTicketStatuses());
    };
  }, [dispatch]);

  const toggleAdd = () => {
    navigate(PATH_SUPPORT.supportTickets.new);
  };

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        // node={
        //   <Stack direction="row" spacing={1}>
        //     {ticketIssueTypes?.length > 0 && (
        //       <RHFAutocomplete
        //         value={selectedIssueType || null}
        //         name="issueType"
        //         label="Issue Type"
        //         sx={{ width: 300 }}
        //         size="small"
        //         options={ticketIssueTypes || []}
        //         isOptionEqualToValue={(option, value) => option._id === value._id}
        //         getOptionLabel={(option) => `${option.name || ''}`}
        //         renderOption={(props, option) => (
        //           <li {...props} key={option?._id}>
        //             {option.name || ''}
        //           </li>
        //         )}
        //         onChange={(event, newValue) => {
        //           if (newValue) {
        //             setSelectedIssueType(newValue);
        //           } else {
        //             setSelectedIssueType(null);
        //           }
        //         }}
        //       />
        //     )}
        //     {ticketStatuses?.length > 0 && (
        //       <RHFAutocomplete
        //         value={selectedStatus || null}
        //         name="status"
        //         label="Status"
        //         sx={{ width: 300 }}
        //         size="small"
        //         options={ticketStatuses || []}
        //         isOptionEqualToValue={(option, value) => option._id === value._id}
        //         getOptionLabel={(option) => `${option.name || ''}`}
        //         renderOption={(props, option) => (
        //           <li {...props} key={option?._id}>
        //             {option.name || ''}
        //           </li>
        //         )}
        //         onChange={(event, newValue) => {
        //           if (newValue) {
        //             setSelectedStatus(newValue);
        //           } else {
        //             setSelectedStatus(null);
        //           }
        //         }}
        //       />
        //     )}
        //   </Stack>
        // }
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDTICKET}
      />
    </Stack>
  );
}