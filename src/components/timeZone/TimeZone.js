import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Popover, Divider } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const TimeDisplay = () => {
  const [localTime, setLocalTime] = useState('');
  const [nzTime, setNzTime] = useState('');
  const [localZone, setLocalZone] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);  // State to manage the anchor for popover
  const [openPopover, setOpenPopover] = useState(false);  // State to control whether popover is open

  useEffect(() => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocalZone(detectedTimeZone);

    const formatTime = (formatter, date) => {
      const formattedTime = formatter.formatToParts(date).map(part => part.value).join('');
      return formattedTime.replace(/am|pm/i, match => match.toUpperCase());
    };

    const updateTime = () => {
      const now = new Date();

      const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };

      const localFormatter = new Intl.DateTimeFormat(undefined, {
        ...options,
        timeZone: detectedTimeZone,
      });

      const nzFormatter = new Intl.DateTimeFormat('en-NZ', {
        ...options,
        timeZone: 'Pacific/Auckland',
        hour12: true,
      });

      setLocalTime(formatTime(localFormatter, now));
      setNzTime(formatTime(nzFormatter, now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const boxStyle = {
    borderRadius: 4,
    minWidth: 200,
    padding: '4px 16px',
  };

  const textStyle = {
    color: '#333',
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopover(true);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
    setOpenPopover(false);
  };

  const open = Boolean(anchorEl) || openPopover;

  // const handleMouseEnter = (event) => {
  //   setAnchorEl(event.currentTarget);
  //   setOpenPopover(true);
  // };

  // const handleMouseLeave = () => {
  //   if (!openPopover) {
  //     setAnchorEl(null);
  //   }
  // };

  return (
    <Box display="flex" alignItems="center" gap={3}>
      <IconButton
        onClick={handleClick}
        // onMouseEnter={handleMouseEnter}
        // onMouseLeave={handleMouseLeave}
        aria-label="time"
      >
        <AccessTimeIcon />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableRestoreFocus
      >
        <Box display="flex" flexDirection="column" padding={1} width={250}>
          <Box sx={boxStyle}>
            <Typography variant="caption" sx={textStyle}>
              <Box component="span" sx={{ fontWeight: 700 }}>
                Pacific/Auckland:
              </Box>{' '}
              {nzTime}
            </Typography>
          </Box>
             
           <Divider sx={{ marginTop: 1 }} />

          <Box sx={boxStyle}>
            <Typography variant="caption" sx={textStyle}>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {localZone}:
              </Box>{' '}
              {localTime}
            </Typography>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
};

export default TimeDisplay;
