import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, alpha } from '@mui/material';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
// import theme from '../../../theme';

export default function TabButtonTooltip({
  title,
  icon,
  color,
  placement,
  disabled,
  selected
}) {

  console.log("selected::::",selected)
    return (
      <StyledTooltip title={title} placement={placement} disableFocusListener tooltipcolor={color} color={color}>
          <IconButton
            sx={{ cursor:'pointer', 
            border:'1px solid',
            borderColor:`${selected?color:"#dbdbdb"}`,
            ':hover':  { borderColor: color},
            }}
          >
            <Iconify color={color} sx={{ height: '20px', width: '20px' }} icon={icon} />
          </IconButton>
      </StyledTooltip>
    );
  }

TabButtonTooltip.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  placement: PropTypes.string,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
};

TabButtonTooltip.defaultProps = {
  placement: 'top',
  color:'#2b64cd'
};
