import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Chip, Stack, Typography, Grow, Fade, Zoom } from '@mui/material';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';

const bounceGrow = keyframes`
  0% { transform: scale(0); }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const AnimatedChip = styled(Chip)(({ theme }) => ({
  animation: `${bounceGrow} 0.5s ease-in-out`,
}));

const AnimatedIntegrationStatusChip = ({ 
  isConnected, 
  syncDate, 
  syncIP, 
  ConnectedIcon, 
  DisconnectedIcon 
}) => (
    <Stack sx={{ position: 'relative' }}>
      <Zoom
        in
        timeout={300}
        key={isConnected ? 'connected' : 'disconnected'} // Forces re-render on status change
      >
        <div>
          <AnimatedChip
            icon={isConnected ? <ConnectedIcon /> : <DisconnectedIcon />}
            label={<strong>{isConnected ? "CONNECTED" : "WAITING FOR CONNECTION"}</strong>}
            color={isConnected ? "primary" : "warning"}
            sx={{
              '& .MuiChip-icon': {
                transition: 'transform 0.3s ease-in-out',
                transform: isConnected ? 'rotate(360deg)' : 'rotate(0deg)',
              }
            }}
          />
        </div>
      </Zoom>

      {isConnected && (
        <Fade in={isConnected} timeout={500}>
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'text.disabled', 
              display: 'block', 
              mt: 1, 
              fontStyle: 'italic' 
            }}
          >
            {`Machine Connection Successfully established on ${syncDate} from ${syncIP}`}
          </Typography>
        </Fade>
      )}
    </Stack>
  );


AnimatedIntegrationStatusChip.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  syncDate: PropTypes.string.isRequired,
  syncIP: PropTypes.string.isRequired,
  ConnectedIcon: PropTypes.elementType.isRequired,
  DisconnectedIcon: PropTypes.elementType.isRequired,
};

export default AnimatedIntegrationStatusChip;