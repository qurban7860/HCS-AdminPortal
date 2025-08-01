import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, alpha } from '@mui/material';
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
  iconSx={}
}) {
  return (
      <StyledTooltip title={title} placement={placement} disableFocusListener tooltipcolor={color} color={color}>
        <IconButton onClick={onClick} disabled={disabled}
          sx={{ color, border: `1px solid ${color}`, cursor:`${onClick?'position':'default'}`, p:0.5, borderRadius:1, ':hover': { borderColor: alpha(color, 0.5),}, ...iconSx}}
          >
          <Iconify color={color} width="25px" icon={icon} />
        </IconButton>            
      </StyledTooltip>
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
  iconSx: PropTypes.object,
};
