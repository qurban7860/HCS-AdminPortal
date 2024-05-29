import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, alpha } from '@mui/material';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
import { MachineIcon } from '../../theme/overrides/CustomIcons';
// import theme from '../../../theme';

export default function TabButtonTooltip({
  title,
  icon,
  color,
  placement,
  disabled,
  selected,
  value
}) {
  
    return (
      <StyledTooltip title={selected?'':title} placement={placement} disableFocusListener tooltipcolor={color} color={color}>
            <IconButton
              sx={{ cursor:'pointer', 
              border:'1px solid',
              borderRadius:1,
              padding:'4px !important',
              borderColor:`${selected?color:"#dbdbdb"}`,
                background:`${selected?color:"#fff"} !important`,
                ':hover':  { borderColor: color},
              }}
              >
              {value==='machine' || value==='machines' ?
                <MachineIcon width="25px" fill={selected?'#fff':color}/>: 
                <Iconify color={selected?'#fff':color} width="25px" icon={icon} />
              }
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
  value: PropTypes.string,
};

TabButtonTooltip.defaultProps = {
  placement: 'bottom',
  color:'#2b64cd'
};
