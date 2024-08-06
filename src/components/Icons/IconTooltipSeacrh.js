import React from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip, alpha } from '@mui/material';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
// import theme from '../../../theme';

export default function IconTooltip({
  onDelete,
  onClick,
  title,
  color='#1976d2',
  placement='top',
  icon,
  disabled,
}) {
  return (
    <>
      {disabled ? (
          <Button
            variant="outlined"
            sx={{ cursor: 'default', color, borderColor: color, ':hover': { borderColor: alpha(color, 0.5),},}}
          >
            <StyledTooltip title={title} placement={placement} disableFocusListener tooltipcolor={color} color={color}>
              <Iconify color={color} sx={{ height: '24px', width: '24px' }} icon={icon} />
            </StyledTooltip>
          </Button>
      ) : (
          <StyledTooltip title={title} placement={placement} disableFocusListener tooltipcolor="#103996" color="#103996">
            <IconButton color={color} sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
              '&:hover': {
                background:"#103996", 
                color:"#fff"
              }
            }}>
              <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon={icon} />
            </IconButton>
          </StyledTooltip>
      )}
    </>
  );
}


IconTooltip.propTypes = {
  onDelete: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  title: PropTypes.string,
  placement: PropTypes.string,
  icon: PropTypes.string,
};
