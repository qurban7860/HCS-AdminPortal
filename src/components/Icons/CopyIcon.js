import React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
import { useSnackbar } from '../snackbar';

export default function CopyIcon({ value, sx }) {

  const { enqueueSnackbar } = useSnackbar();
  
  const theme = createTheme({
    palette: { success: green },
  });

  const copyTextToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      enqueueSnackbar('Copied!');
    } catch (err) {
      enqueueSnackbar('Copy Failed!');
    }
  };

  return (
    <StyledTooltip
      arrow
      title="Copy"
      placement='top'
      tooltipcolor={theme.palette.primary.main}
    >
      <Iconify icon="mingcute:copy-line" sx={{ cursor: 'pointer', ml: 1, mb: -0.7, ...sx }} onClick={() => copyTextToClipboard(value)}/>
    </StyledTooltip>
  );
}

CopyIcon.propTypes = {
  value: PropTypes.string,
  sx: PropTypes.object,
};