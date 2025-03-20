import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
import { useSettingsContext } from '../settings';

export default function FullScreenIcon({ sx }) {
  const [fullscreen, setFullscreen] = useState(false);
  const theme = createTheme({ palette: { success: green } });
  const { themeLayout, onToggleLayout } = useSettingsContext();

  const onToggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
      if (themeLayout === 'vertical') {
        onToggleLayout();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
      if (themeLayout !== 'vertical') {
        onToggleLayout();
      }
    }
  };

  return (
    <StyledTooltip
      arrow
      title={fullscreen ? "Exit Full Screen" : "Full Screen"}
      placement='top'
      tooltipcolor={theme.palette.primary.main}
    >
      <Iconify icon={fullscreen ? "mdi:fullscreen-exit" : "mdi:fullscreen"} sx={{ cursor: 'pointer', ml: "auto", m: 1, width: "30px", height: "30px", ...sx }} onClick={onToggleFullScreen} />
    </StyledTooltip>
  );
}

FullScreenIcon.propTypes = {
  sx: PropTypes.object,
};