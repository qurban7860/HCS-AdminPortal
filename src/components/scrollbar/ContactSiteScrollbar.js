import PropTypes from 'prop-types';
import { memo } from 'react';
// @mui
import { Box } from '@mui/material';
//
import { StyledRootScrollbar, StyledScrollbar } from './styles';

// ----------------------------------------------------------------------

ContactSiteScrollbar.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node,
};

function ContactSiteScrollbar({ children, sx, ...other }) {
  const userAgent = typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    );
  }

  return (
    <StyledRootScrollbar sx={{padding:0.5, background:'#e8e8e9', border:'1px solid #d9d9d9', borderRadius:1, maxheight: '100%', height: 'calc(100dvh - 130px)'}}>
      <StyledScrollbar timeout={500} clickOnTrack={false} {...other}>
        {children}
      </StyledScrollbar>
    </StyledRootScrollbar>
  );
}

export default memo(ContactSiteScrollbar);
