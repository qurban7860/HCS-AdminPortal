import React from 'react';
import PropTypes from 'prop-types';
import { Grid, DialogTitle } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import Iconify from '../iconify';
import { StyledTooltip } from '../../theme/styles/default-styles';

function DialogLabel({ onClick, content }) {

  const theme = createTheme({
    palette: {
      success: green,
    },
  });

  return (
    <Grid display="flex" justifyContent="space-between">
      <DialogTitle variant='h4' sx={{ ml: -0.5, my:-1.0 }} id="customized-dialog-title">{content}</DialogTitle>
      <StyledTooltip
        title="Close"
        placement="top" 
        disableFocusListener 
        tooltipcolor={theme.palette.primary.main} 
      >
        <Iconify onClick={onClick} sx={{ width: "25px", height:"25px", cursor: "pointer", mr: 2.5, mt:2.5 }} icon="mdi:close" />
      </StyledTooltip>
    </Grid>
  );
}

DialogLabel.propTypes = {
  onClick: PropTypes.func,
  content: PropTypes.string,
};

export default DialogLabel;
