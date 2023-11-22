import React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';

export default function CopyIcon({ value }) {

  const { enqueueSnackbar } = useSnackbar();
  const theme = createTheme({
                              palette: { success: green },
                            });
  const copyTextToClipboard = (textToCopy) => {
    try{
      const tempInput = document.createElement('input');
      tempInput.value = textToCopy;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    enqueueSnackbar("Copied!");
    }catch(err){
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
      <Iconify icon="mingcute:copy-line" sx={{ cursor: 'pointer',ml:1,mb:-0.7 }} onClick={()=> copyTextToClipboard(value)}/>
    </StyledTooltip>
  );
}

CopyIcon.propTypes = {
  value: PropTypes.string,
};
