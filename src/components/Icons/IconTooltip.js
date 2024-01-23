import React from 'react';
import PropTypes from 'prop-types';
import { Button, alpha } from '@mui/material';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
// import theme from '../../../theme';

export default function IconTooltip({
  onDelete,
  onClick,
  color,
  title,
  placement,
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
        <Button onClick={onClick} 
          variant="outlined"
          sx={{ cursor: onClick ? 'pointer' : 'default', color, borderColor: color, ':hover': { borderColor: alpha(color, 0.5)}}}
        >
          <StyledTooltip title={title} placement={placement} disableFocusListener tooltipcolor={color} color={color}>
            <Iconify color={color} sx={{ height: '24px', width: '24px' }} icon={icon} />
          </StyledTooltip>
        </Button>
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

IconTooltip.defaultProps = {
  placement: 'top',
  color:'#1976d2'
};
