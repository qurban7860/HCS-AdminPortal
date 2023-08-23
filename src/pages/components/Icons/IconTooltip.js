import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Button, Typography, Tooltip, alpha } from '@mui/material';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import theme from '../../../theme';

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
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outlined"
      sx={{
        color,
        borderColor: color,
        ':hover': {
          borderColor: alpha(color, 0.5),
        },
      }}
      // color={disableDeleteButton ? 'secondary' :'error'}
    >
      <StyledTooltip
        title={title}
        placement={placement}
        disableFocusListener
        tooltipcolor={color}
        color={color}
      >
        <Iconify sx={{ height: '24px', width: '24px' }} icon={icon} />
      </StyledTooltip>
    </Button>
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
};
