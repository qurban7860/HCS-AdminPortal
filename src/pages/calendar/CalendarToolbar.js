import PropTypes from 'prop-types';
// @mui
import { Stack, Tooltip, Typography, IconButton, ToggleButton, Autocomplete, TextField } from '@mui/material';
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
import { getWeekRange } from './util';  


// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Month', icon: 'ic:round-view-module' },
  { value: 'timeGridWeek', label: 'Week', icon: 'ic:round-view-week' },
  { value: 'timeGridDay', label: 'Day', icon: 'ic:round-view-day' },
  { value: 'listMonth', label: 'Agenda', icon: 'ic:round-view-agenda' },
];

// ----------------------------------------------------------------------

CalendarToolbar.propTypes = {
  selectedCustomer: PropTypes.object,
  setSelectedCustomer: PropTypes.func,
  selectedContact: PropTypes.object,
  setSelectedContact: PropTypes.func,
  onNextDate: PropTypes.func,
  onPrevDate: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onChangeView: PropTypes.func,
  date: PropTypes.instanceOf(Date),
  view: PropTypes.oneOf(['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listMonth']),
};

export default function CalendarToolbar({
  selectedCustomer,
  setSelectedCustomer,
  selectedContact,
  setSelectedContact,
  date,
  view,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilter,
}) {
  
  const { isAllAccessAllowed, isSettingReadOnly } = useAuthContext();
  const dispatch= useDispatch();
  const isDesktop = useResponsive('up', 'sm');
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeSpContacts } = useSelector((state) => state.contact);
  const { startOfWeek, endOfWeek } = getWeekRange(date)

  return (
    <Stack
      alignItems="center"
      justifyContent="space-between"
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 2.5 }}
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

      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPrevDate}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton> 

        <Typography variant="h5">{  ((( view === 'dayGridMonth' ) || ( view === 'listMonth' ) ) && fDate(date, 'MMM yyyy')) || ( view === 'timeGridWeek' && `${fDate(startOfWeek, 'dd MMM')} - ${fDate(endOfWeek, 'dd MMM')} ${fDate(date, 'yyyy')}`)  || fDate(date, 'dd MMM yyyy')}</Typography>

        <IconButton onClick={onNextDate}>
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </IconButton>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={2}>
        {isAllAccessAllowed && !isSettingReadOnly && 
          <Autocomplete 
            value={ selectedContact || null}
            options={activeSpContacts}
            isOptionEqualToValue={(option, val) => option?._id === val?._id}
            getOptionLabel={(option) => `${option?.firstName || ''}`}
            onChange={(event, newValue) => {
              if (newValue) {
                setSelectedContact(newValue);
              } else {
                setSelectedContact(null);
              }
            }}
            sx={{width: '225px'}}
            renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option?.firstName || ''}`}</li>)}
            renderInput={(params) => <TextField {...params} size='small' label="Contact" />}
          />
        }

        {isAllAccessAllowed && !isSettingReadOnly && <Autocomplete 
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
        />}
        <StyledTooltip title="New Event" placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
          <IconButton color="#fff" onClick={()=> {
            dispatch(setEventModel(true))
            dispatch(setSelectedEvent(null))
          }} 
            sx={{ background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                  '&:hover': { background:"#103996", color:"#fff" } }}>
            <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='eva:plus-fill' />
          </IconButton>
        </StyledTooltip>
      </Stack>
    </Stack>
  );
}
