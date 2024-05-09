import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, alpha } from '@mui/material';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
// import theme from '../../../theme';

export default function IconButtonTooltip({
  onDelete,
  onClick,
  color,
  title,
  placement,
  icon,
  disabled,
}) {
    return (
      <StyledTooltip title={title} placement={placement} disableFocusListener tooltipcolor={color} color={color}>
        {disabled ? (
          <IconButton
            variant="outlined"
            sx={{ ml:1, cursor: 'default', color, borderColor: color, ':hover': { borderColor: alpha(color, 0.5),},}}
          >
              <Iconify color={color} sx={{ height: '20px', width: '20px' }} icon={icon} />
          </IconButton>
        ) : (
          <IconButton onClick={onClick}
            sx={{ ml:1, cursor: onClick ? 'pointer' : 'default', color, borderColor: color, ':hover': { borderColor: alpha(color, 0.5)}}}
          >
            <Iconify color={color} sx={{ height: '20px', width: '20px' }} icon={icon} />
          </IconButton>
        )}
      </StyledTooltip>
    );
  }


IconButtonTooltip.propTypes = {
  onDelete: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  color: PropTypes.string,
  title: PropTypes.string,
  placement: PropTypes.string,
  icon: PropTypes.string,
};

IconButtonTooltip.defaultProps = {
  placement: 'top',
  color:'#1976d2'
};
