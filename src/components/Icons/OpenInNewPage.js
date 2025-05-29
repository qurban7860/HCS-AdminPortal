import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@mui/material';
import Iconify from '../iconify';
import { StyledTooltip } from '../../theme/styles/default-styles';


export default function OpenInNewPage({ onClick  }) {
  
  return (
        <StyledTooltip
          title='Open in new page'
          placement="top"
          disableFocusListener
        >
          <Link onClick={onClick} color="inherit" target="_blank" rel="noopener" sx={{ cursor: 'pointer',mx: 0.5}}>
            <Iconify icon="fluent:open-12-regular" sx={{position:'relative', bottom:'-5px'}} />
          </Link>
        </StyledTooltip>
  );
}

OpenInNewPage.propTypes = {
  onClick: PropTypes.func,
};
