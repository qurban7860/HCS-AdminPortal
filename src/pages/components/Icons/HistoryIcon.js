import React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';

export default function HistoryIcon({ callFunction }) {

  const theme = createTheme({ palette: { success: green } });

  return (
      <StyledTooltip
        arrow
        title="History"
        placement='top'
        tooltipcolor={theme.palette.primary.main}
      >
        <Iconify icon="lucide:list-restart" sx={{ml:0.7, cursor: 'pointer'}} onClick={callFunction} />
      </StyledTooltip>
  );
}

HistoryIcon.propTypes = {
  callFunction: PropTypes.func,
};
