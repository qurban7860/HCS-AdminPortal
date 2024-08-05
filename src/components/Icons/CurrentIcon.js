import React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';

export default function CurrentIcon({ callFunction }) {

  const theme = createTheme({ palette: { success: green } });

  return (
      <StyledTooltip arrow title="Current Version" placement='top' tooltipcolor={theme.palette.primary.main} >
        <Iconify icon="lucide:list-start" width={25} height={25} sx={{ml:1, cursor: 'pointer'}} onClick={callFunction} />
      </StyledTooltip>
  );
}

CurrentIcon.propTypes = {
  callFunction: PropTypes.func,
};
