import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip, alpha } from '@mui/material';
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

    return (
      <>
      {/* <StyledTooltip title={title} placement={placement} tooltipcolor={color} color={color}> */}
        <Tooltip title={title} placement='bottom'>
          <IconButton
            sx={{ cursor:'pointer', 
            border:'1px solid',
            borderRadius:1,
            borderColor:`${selected?color:"#dbdbdb"}`,
              background:`${selected?color:"#fff"} !important`,
              ':hover':  { borderColor: color},
            }}
            >
            <Iconify color={selected?'#fff':color} width="20px" icon={icon} />
          </IconButton>
          {selected && ` ${title}`}
        </Tooltip>
      {/* </StyledTooltip> */}
      </>
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
