import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Typography } from '@mui/material';
// styles
import { useTheme } from '@mui/material/styles';
// components
import Iconify from '../iconify/Iconify';
import { StyledTooltip } from '../../theme/styles/default-styles';

ThumbnailDocButton.propTypes = {
  onClick: PropTypes.func,
  size:PropTypes.number,
  disabled: PropTypes.bool,
};

export default function ThumbnailDocButton({ onClick, size=150, disabled }) {
  return (
    <StyledTooltip placement="top" title={size>=150?"":"Add File"}>
      <Button onClick={onClick} variant='outlined' sx={{display:'block', height:size, width:'100%'}} disabled={disabled} >
        <Iconify icon="mdi:plus" width={50} />
        <Typography variant="subtitle2">Add / Upload File</Typography>
      </Button>
    </StyledTooltip>
  );
}
