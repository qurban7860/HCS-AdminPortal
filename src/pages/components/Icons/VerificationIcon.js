import React from 'react';
import PropTypes from 'prop-types';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';

export default function VerificationIcon({ isVerified }) {
  return (
    <StyledTooltip
      title={isVerified ? 'Verified' : 'Not Verified'}
      placement="top"
      disableFocusListener
      tooltipcolor={isVerified ? 'green' : 'red'}
    >
      <Iconify
        icon={isVerified ? 'ic:round-verified-user' : 'mdi:shield-outline'}
        color={isVerified ? 'green' : 'red'}
        width="1.5em"
        sx={{
          mb: -0.5,
          mr: 0.5,
        }}
      />
    </StyledTooltip>
  );
}

VerificationIcon.propTypes = {
  isVerified: PropTypes.bool,
};
