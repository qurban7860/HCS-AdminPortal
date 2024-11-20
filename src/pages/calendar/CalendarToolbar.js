import { memo } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Stack, Typography, IconButton, ToggleButton, Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// utils
import { fDate } from '../../utils/formatTime';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';
import { setEventModel, setSelectedEvent } from '../../redux/slices/event/event';
import { StyledTooltip } from '../../theme/styles/default-styles';
import { useAuthContext } from '../../auth/useAuthContext';  
import { getWeekRange } from './utils/util';  

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Month', icon: 'ic:round-view-module' },
  { value: 'timeGridWeek', label: 'Week', icon: 'ic:round-view-week' },
  { value: 'timeGridDay', label: 'Day', icon: 'ic:round-view-day' },
  { value: 'listMonth', label: 'Agenda', icon: 'ic:round-view-agenda' },
];

const statusOptions = [
  { label: 'To Do', value: 'To Do', color: '#FBC02D' },
  { label: 'In Progress', value: 'In Progress', color: '#1E88E5' },
  { label: 'Done', value: 'Done', color: '#388E3C' },
  { label: 'Cancelled', value: 'Cancelled', color: '#D32F2F' },
];

// ----------------------------------------------------------------------

CalendarToolbar.propTypes = {
  selectedCustomer: PropTypes.object,
  setSelectedCustomer: PropTypes.func,
  selectedContact: PropTypes.object,
  setSelectedContact: PropTypes.func,
  selectedUser: PropTypes.object,
  setSelectedUser: PropTypes.func,
  selectedStatus: PropTypes.object,
  setSelectedStatus: PropTypes.func,
  onNextDate: PropTypes.func,
  onPrevDate: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onChangeView: PropTypes.func,
  date: PropTypes.instanceOf(Date),
  view: PropTypes.oneOf(['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listMonth']),
};

function CalendarToolbar({
  selectedCustomer,
  setSelectedCustomer,
  selectedContact,
  setSelectedContact,
  selectedUser,
  setSelectedUser,
  selectedStatus,
  setSelectedStatus,
  date,
  view,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilter,
}) {
  
  const dispatch= useDispatch();
  const isDesktop = useResponsive('up', 'sm');
  const { userId, isAllAccessAllowed, user } = useAuthContext();
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeSpContacts } = useSelector((state) => state.contact);
  const { activeSecurityUsers } = useSelector((state) => state.user);
  const { startOfWeek, endOfWeek } = getWeekRange(date);
  
  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 2.5,
        flexWrap: 'wrap', 
        rowGap: 2, 
        columnGap: 2,
       }}
    >
      {isDesktop && (
        <Stack direction="row" spacing={1}>
          {VIEW_OPTIONS.map((viewOption) => (
            <StyledTooltip placement="top" key={viewOption.value} title={viewOption.label}>
              <ToggleButton size="medium" value={view} selected={viewOption.value === view} onChange={() => onChangeView(viewOption.value)}>
                <Iconify icon={viewOption.icon} />
              </ToggleButton>
            </StyledTooltip>
          ))}
        </Stack>
      )}

      <Stack direction="row" alignItems="center" justifyContent="center" sx={{ flexGrow: 1, flexWrap: 'wrap', rowGap: 2, columnGap: 2, mr: 25}}>
        <IconButton onClick={onPrevDate}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton> 

        <Typography variant="h5">{  ((( view === 'dayGridMonth' ) || ( view === 'listMonth' ) ) && fDate(date, 'MMM yyyy')) || ( view === 'timeGridWeek' && `${fDate(startOfWeek, 'dd MMM')} - ${fDate(endOfWeek, 'dd MMM')} ${fDate(date, 'yyyy')}`)  || fDate(date, 'dd MMM yyyy')}</Typography>

        <IconButton onClick={onNextDate}>
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </IconButton>
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap', rowGap: 2, columnGap: 2, justifyContent: 'flex-start', width: '100%' }}>
          <Autocomplete 
            value={ selectedContact || null}
            options={isAllAccessAllowed ? activeSpContacts : activeSpContacts?.filter((spc)=> spc?.reportingTo === user?.contact || spc?._id === user?.contact )}
            isOptionEqualToValue={(option, val) => option?._id === val?._id}
            getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedContact(newValue);
              } else {
                setSelectedContact(null);
              }
            }}
            sx={{width: '225px'}}
            renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''}`}</li>)}
            renderInput={(params) => <TextField {...params} size='small' label="Contact" />}
          />
          
        <Autocomplete 
          value={ selectedCustomer || null}
          options={activeCustomers}
          isOptionEqualToValue={(option, val) => option?._id === val?._id}
          getOptionLabel={(option) => `${option?.name || ''}`}
          onChange={(event, newValue) => {
            if (newValue) {
              setSelectedCustomer(newValue);
            } else {
              setSelectedCustomer(null);
            }
          }}
          sx={{width: '225px'}}
          renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.name || ''}`}</li>)}
          renderInput={(params) => <TextField {...params} size='small' label="Customer" />}
        />

        {isAllAccessAllowed && 
          <Autocomplete 
            value={ selectedUser || null}
            options={isAllAccessAllowed?activeSecurityUsers:activeSecurityUsers?.filter((su)=> su?.contact?.reportingTo === user?.contact || su?._id === userId )}
            isOptionEqualToValue={(option, val) => option?._id === val?._id}
            getOptionLabel={(option) => `${option?.name || ''}`}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedUser(newValue);
              } else {
                setSelectedUser(null);
              }
            }}
            sx={{width: '225px'}}
            renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.name || ''}`}</li>)}
            renderInput={(params) => <TextField {...params} size='small' label="Added By" />}
          />
        }
        
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
          sx={{ width: '225px' }}
          renderOption={(props, option) => ( <li {...props} key={option.value} style={{ color: option.color }}>{option.label}</li>)}
          renderInput={(params) => <TextField {...params} size="small" label="Status" 
          InputProps={{...params.InputProps, style: { color: selectedStatus?.color || 'inherit' },
          }} />}
        />
        
        <StyledTooltip title="New Event" placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
          <IconButton color="#fff" onClick={()=> {
            dispatch(setEventModel(true))
            dispatch(setSelectedEvent(null))
          }} 
            sx={{ background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px', marginLeft: 'auto',
                  '&:hover': { background:"#103996", color:"#fff" } }}>
            <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='eva:plus-fill' />
          </IconButton>
        </StyledTooltip>
      </Stack>
    </Stack>
  );
}

export default memo( CalendarToolbar );