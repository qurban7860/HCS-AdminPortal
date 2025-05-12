import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Popover,
  Divider,
  Tooltip,
  createTheme
} from '@mui/material';
import { green } from '@mui/material/colors';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { StyledTooltip } from '../../theme/styles/default-styles';


const TimeDisplay = () => {
  const [localTime, setLocalTime] = useState({ datePart: '', timePart: '' });
  const [nzTime, setNzTime] = useState({ datePart: '', timePart: '' });
  const [localZone, setLocalZone] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = createTheme({ palette: { success: green } });

  useEffect(() => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocalZone(detectedTimeZone);

    const formatDate = (date, timeZone) => {
      const datePart = new Intl.DateTimeFormat('en-NZ', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        timeZone,
      })
        .format(date)
        .replace(/(\w{3}) (\d{2}) (\w{3})/, '$1, $2 $3');

      let timePart = new Intl.DateTimeFormat('en-NZ', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone,
      }).format(date);

      timePart = timePart.replace(/\b(am|pm)\b/i, match => match.toUpperCase());

      return { datePart, timePart };
    };

    const updateTime = () => {
      const now = new Date();
      setNzTime(formatDate(now, 'Pacific/Auckland'));
      setLocalTime(formatDate(now, detectedTimeZone));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const showBoth =
    nzTime.datePart !== localTime.datePart || nzTime.timePart !== localTime.timePart;

  const boxStyle = {
    borderRadius: 4,
    minWidth: 200,
    padding: '4px 16px',
  };

  const textStyle = {
    color: '#333',
  };

  const renderTimeBox = (label, { datePart, timePart }) => (
    <Box sx={boxStyle}>
      <Typography variant="caption" sx={textStyle}>
        <Box component="span" sx={{ fontWeight: 'bold' }}>
          {label} - 
        </Box>
        <Box component="span" sx={{ display: 'inline' }}>
          {`  ${datePart}`}
        </Box>
        <Box component="span" sx={{ display: 'block' }}>
          {timePart}
        </Box>
      </Typography>
    </Box>
  );

  return (
    <Box display="flex" alignItems="center" gap={3} >
      <StyledTooltip
      arrow
      title="Time Zones"
      placement="top"
         tooltipcolor={theme.palette.primary.main}
    >
      <IconButton onClick={handleClick} aria-label="time">
        <AccessTimeIcon />
      </IconButton>
    </StyledTooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        disableRestoreFocus
      >
        <Box display="flex" flexDirection="column" padding={1} width={250}>
          {renderTimeBox('Pacific/Auckland', nzTime)}

          {showBoth && (
            <>
              <Divider sx={{ marginTop: 1 }} />
              {renderTimeBox(localZone, localTime)}
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
};

export default TimeDisplay;
