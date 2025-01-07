import PropTypes from 'prop-types';
// @mui
import { Stack, TextField, Autocomplete } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SUPPORT } from '../../routes/paths';
// constants
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

  const toggleAdd = () => {
    navigate(PATH_SUPPORT.supportTickets.new);
  };

  const statusOptions = [
    { label: 'To Do', value: 'To Do', color: '#FBC02D' },
    { label: 'In Progress', value: 'In Progress', color: '#1E88E5' },
    { label: 'Done', value: 'Done', color: '#388E3C' },
    { label: 'Cancelled', value: 'Cancelled', color: '#D32F2F' },
  ];

  const issueTypeOptions = [
    { label: 'System Problem', value: 'System Problem' },
    { label: 'Change Request', value: 'Change Request' },
    { label: 'System Incident', value: 'System Incident' },
    { label: 'Service Request', value: 'Service Request' },
  ];

  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        node={
          <Stack direction="row" spacing={1}>
            <Autocomplete
              value={selectedIssueType || null}
              options={issueTypeOptions}
              isOptionEqualToValue={(option, val) => option.value === val?.value}
              getOptionLabel={(option) => option?.label || ''}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedIssueType(newValue);
                } else {
                  setSelectedIssueType(null);
                }
              }}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} size="small" label="Issue Type" />}
            />
            <Autocomplete
              value={selectedStatus || null}
              options={statusOptions}
              isOptionEqualToValue={(option, val) => option.value === val?.value}
              getOptionLabel={(option) => option?.label || ''}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSelectedStatus(newValue);
                } else {
                  setSelectedStatus(null);
                }
              }}
              sx={{ width: 300 }}
              renderOption={(props, option) => ( <li {...props} key={option.value} style={{ color: option.color }}> {option.label} </li> )}
              renderInput={(params) => ( <TextField {...params} size="small" label="Status" InputProps={{ ...params.InputProps, style: { color: selectedStatus?.color || 'inherit' } }}/> )}
            />
          </Stack>
        }
        SubOnClick={toggleAdd}
        addButton={BUTTONS.ADDTICKET}
      />
    </Stack>
  );
}
