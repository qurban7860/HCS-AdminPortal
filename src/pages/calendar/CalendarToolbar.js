// import React, { useState} from 'react';
import PropTypes from 'prop-types';
// @mui
import { Stack, Tooltip, Typography, IconButton, ToggleButton } from '@mui/material';
import { useDispatch } from 'react-redux';

// import { DemoContainer, DemoItem  } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

// utils
import { fDate } from '../../utils/formatTime';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import Iconify from '../../components/iconify';
import { onOpenModal } from '../../redux/slices/visit/visit';
import { StyledTooltip } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  { value: 'dayGridMonth', label: 'Month', icon: 'ic:round-view-module' },
  { value: 'timeGridWeek', label: 'Week', icon: 'ic:round-view-week' },
  { value: 'timeGridDay', label: 'Day', icon: 'ic:round-view-day' },
  { value: 'listWeek', label: 'Agenda', icon: 'ic:round-view-agenda' },
];

// ----------------------------------------------------------------------

CalendarToolbar.propTypes = {
  onToday: PropTypes.func,
  onNextDate: PropTypes.func,
  onPrevDate: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onChangeView: PropTypes.func,
  date: PropTypes.instanceOf(Date),
  view: PropTypes.oneOf(['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek']),
};

export default function CalendarToolbar({
  date,
  view,
  onToday,
  onNextDate,
  onPrevDate,
  onChangeView,
  onOpenFilter,
}) {
  // const [value, setValue] = useState([ '2022-04-17', '2022-04-21' ]);
  const dispatch= useDispatch();
  const isDesktop = useResponsive('up', 'sm');

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
            <Tooltip key={viewOption.value} title={viewOption.label}>
              <ToggleButton
                size="small"
                value={view}
                selected={viewOption.value === view}
                onChange={() => onChangeView(viewOption.value)}
              >
                <Iconify icon={viewOption.icon} />
              </ToggleButton>
            </Tooltip>
          ))}
        </Stack>
      )}

      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPrevDate}>
          <Iconify icon="eva:arrow-ios-back-fill" />
        </IconButton>

        <Typography variant="h5">{fDate(date, 'MMM yyyy')}</Typography>

        <IconButton onClick={onNextDate}>
          <Iconify icon="eva:arrow-ios-forward-fill" />
        </IconButton>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1}>
        {/* <DateRangePicker value={value} onChange={(newValue) => setValue(newValue)}/> */}
        <StyledTooltip title="New Visit" placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
          <IconButton color="#fff" onClick={()=> dispatch(onOpenModal())} 
            sx={{ background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                  '&:hover': { background:"#103996", color:"#fff" } }}>
            <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='eva:plus-fill' />
          </IconButton>
        </StyledTooltip>
      </Stack>
    </Stack>
  );
}
