import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Stack, TextField, Autocomplete} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SUPPORT } from '../../routes/paths';
// constants
import { getActiveTicketStatuses, resetActiveTicketStatuses } from '../../redux/slices/ticket/ticketSettings/ticketStatuses';
import { getActiveTicketStatusTypes, resetActiveTicketStatusTypes } from '../../redux/slices/ticket/ticketSettings/ticketStatusTypes';
import { BUTTONS } from '../../constants/default-constants';
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
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { activeTicketStatuses } = useSelector((state) => state.ticketStatuses);
  const { activeTicketStatusTypes } = useSelector((state) => state.ticketStatusTypes);

  useEffect(() => {
    dispatch(getActiveTicketStatuses());
    dispatch(getActiveTicketStatusTypes());
    return () => {
      dispatch(resetActiveTicketStatuses());
      dispatch(resetActiveTicketStatusTypes());
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
        node={
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, display: 'flex' }}>
              <Autocomplete
                value={filterStatus || []}
                name="status"
                sx={{ minWidth: { sm: 400 } }}
                options={activeTicketStatuses}
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
              <Autocomplete
                value={filterStatusType || null}
                name="statusType"
                sx={{ minWidth: { sm: 200 } }}
                options={activeTicketStatusTypes}
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
          </Stack>
        }
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDTICKET}
      />
    </Stack>
  );
}


