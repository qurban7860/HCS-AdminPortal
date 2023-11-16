import React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';

export default function CurrentIcon({ callFunction }) {

  const theme = createTheme({ palette: { success: green } });

  return (
      <StyledTooltip
        arrow
        title="Current Version"
        placement='top'
        tooltipcolor={theme.palette.primary.main}
      >
        <Iconify icon="cil:list-high-priority" width={23} height={23} color={theme.palette.primary.main} sx={{ml:1, mb:0.2 ,cursor: 'pointer'}} onClick={callFunction} />
      </StyledTooltip>
  );
}

CurrentIcon.propTypes = {
  callFunction: PropTypes.func,
};
