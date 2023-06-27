import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Popover, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { StyledPopover } from '../../theme/styles/default-styles';
import Iconify from '../../components/iconify';

export default function IconPopover({
  isActive,
  deleteDisabled,
  customerVerificationCount,
  machineVerificationCount,
  verified,
  verifyBadgeClick,
  documentIsActive,
  customerAccess,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState([]);
  const open = Boolean(anchorEl);
  const isPopoverOpen = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleVerifiedPopoverOpen = (event) => {
    setVerifiedAnchorEl(event.currentTarget);
  };

  const handleVerifiedPopoverClose = () => {
    setVerifiedAnchorEl(null);
  };

  return (
    <>
      {/* isActive Icon */}
      {isActive && (
        <>
          <IconButton
            aria-label={isActive ? 'Active' : 'Inactive'}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={isActive ? 'Active' : 'Inactive'}
              icon={isActive ? 'mdi:check-circle' : 'mdi:checkbox-multiple-blank-circle-outline'}
              style={{ color: isActive ? 'green' : 'red' }}
              width="30px"
            />
          </IconButton>
          <StyledPopover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            id="mouse-over-popover"
          >
            <Typography variant="overline" color={isActive ? 'green' : 'red'}>
              {isActive ? 'Active' : 'Inactive'}
            </Typography>
          </StyledPopover>
        </>
      )}

      {/* deleteDisabled icon */}
      {deleteDisabled && (
        <>
          <IconButton
            aria-label={deleteDisabled ? 'Delete Disabled' : 'Delete Enabled'}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={deleteDisabled ? 'Delete Disabled' : 'Delete Enabled'}
              icon={deleteDisabled ? 'mdi:delete-forever' : 'mdi:delete'}
              style={{ color: deleteDisabled ? 'green' : 'red' }}
              width="30px"
            />
          </IconButton>
          <StyledPopover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            id="mouse-over-popover"
          >
            <Typography variant="overline" color={deleteDisabled ? 'green' : 'red'}>
              {deleteDisabled ? 'Delete Disabled' : 'Delete Enabled'}
            </Typography>
          </StyledPopover>
        </>
      )}

      {/* isVerified icon and badge for machine and customer */}
      {(customerVerificationCount || machineVerificationCount > 0) && verified > 0 && (
        <>
          <IconButton
            aria-label={
              customerVerificationCount || machineVerificationCount > 0
                ? 'Verified'
                : 'Not Verified'
            }
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={
                customerVerificationCount || machineVerificationCount > 0
                  ? 'Verified'
                  : 'Not Verified'
              }
              icon="ic:round-verified-user"
              style={{
                color: customerVerificationCount || machineVerificationCount > 0 ? 'green' : 'red',
              }}
              width="30px"
            />
            <StyledPopover
              open={isPopoverOpen}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'center',
                horizontal: 'center',
              }}
              id="mouse-over-popover"
            >
              <Typography
                variant="overline"
                color={customerVerificationCount || machineVerificationCount > 0 ? 'green' : 'red'}
              >
                {customerVerificationCount || machineVerificationCount > 0
                  ? 'Verified'
                  : 'Not Verified'}
              </Typography>
            </StyledPopover>
          </IconButton>
          {(customerVerificationCount || machineVerificationCount) > 0 && (
            <IconButton
              onClick={verifyBadgeClick}
              size="small"
              sx={{
                width: '24px',
                height: '24px',
                bottom: 17,
                left: -24,
                color: (themee) => alpha(themee.palette.common.white, 0.8),
                bgcolor: (themee) => alpha(themee.palette.grey[900], 0.72),
                '&:hover': {
                  bgcolor: (themee) => alpha(themee.palette.grey[900], 0.98),
                },
              }}
            >
              <Typography variant="body2">
                {(customerVerificationCount || machineVerificationCount) > 99
                  ? 99
                  : customerVerificationCount || machineVerificationCount}
              </Typography>
            </IconButton>
          )}
        </>
      )}

      {/* documentIsActive icon */}
      {documentIsActive !== undefined && (
        <>
          <IconButton
            aria-label={documentIsActive ? 'Active' : 'Inactive'}
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={documentIsActive ? 'Active' : 'Inactive'}
              icon={documentIsActive ? 'basil:document-solid' : 'basil:document-solid'}
              style={{ color: documentIsActive ? 'green' : 'red' }}
              width="30px"
            />
          </IconButton>
          <StyledPopover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            id="mouse-over-popover"
          >
            <Typography variant="overline" color={documentIsActive ? 'green' : 'red'}>
              {documentIsActive ? 'Active' : 'Inactive'}
            </Typography>
          </StyledPopover>
        </>
      )}

      {/* customerAccess icon */}
      {customerAccess !== undefined && (
        <>
          <IconButton
            aria-label={customerAccess ? 'Allowed' : 'Disallowed'}
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={customerAccess ? 'Allowed' : 'Disallowed'}
              icon={customerAccess ? 'mdi:book-check' : 'mdi:book-cancel-outline'}
              style={{ color: customerAccess ? 'green' : 'red' }}
              width="30px"
            />
          </IconButton>
          <StyledPopover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            id="mouse-over-popover"
          >
            <Typography variant="overline" color={customerAccess ? 'green' : 'red'}>
              {customerAccess ? 'Allowed' : 'Disallowed'}
            </Typography>
          </StyledPopover>
        </>
      )}
    </>
  );
}

IconPopover.propTypes = {
  isActive: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  customerVerificationCount: PropTypes.number,
  machineVerificationCount: PropTypes.number,
  verified: PropTypes.number,
  verifyBadgeClick: PropTypes.func,
  documentIsActive: PropTypes.bool,
  customerAccess: PropTypes.bool,
};
