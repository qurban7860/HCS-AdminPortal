import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Button, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { StyledPopover } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import { ICONS } from '../../../constants/icons/default-icons';

export default function IconPopover({
  isActive,
  isRequired,
  deleteDisabled,
  customerVerificationCount,
  machineVerificationCount,
  verified,
  verifyBadgeClick,
  documentIsActive,
  customerAccess,
  sites,
  onMapClick,
  multiAuth,
  currentEmp
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {/* isActive Icon */}
      {isActive !== undefined && (
        <>
          <IconButton
            aria-label={isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading}
              icon={isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon}
              style={{ color: isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color }}
              width={ICONS.size}
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
            <Typography
              variant={ICONS.variant}
              color={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
            >
              {isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading}
            </Typography>
          </StyledPopover>
        </>
      )}

      {isRequired !== undefined && (
        <>
          <IconButton
            aria-label={isRequired ? ICONS.REQUIRED.heading : ICONS.NOTREQUIRED.heading}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={isRequired ? ICONS.REQUIRED.heading : ICONS.NOTREQUIRED.heading}
              icon={isRequired ? ICONS.REQUIRED.icon : ICONS.NOTREQUIRED.icon}
              style={{ color: isRequired ? ICONS.REQUIRED.color : ICONS.NOTREQUIRED.color }}
              width={ICONS.size}
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
            <Typography
              variant={ICONS.variant}
              color={isRequired ? ICONS.REQUIRED.color : ICONS.NOTREQUIRED.color}
            >
              {isRequired ? ICONS.REQUIRED.heading : ICONS.NOTREQUIRED.heading}
            </Typography>
          </StyledPopover>
        </>
      )}

      {/* deleteDisabled icon */}
      {deleteDisabled && (
        <>
          <IconButton
            aria-label={
              deleteDisabled ? ICONS.DELETE_DISABLED.heading : ICONS.DELETE_ENABLED.heading
            }
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={
                deleteDisabled ? ICONS.DELETE_DISABLED.heading : ICONS.DELETE_ENABLED.heading
              }
              icon={deleteDisabled ? ICONS.DELETE_DISABLED.icon : ICONS.DELETE_ENABLED.icon}
              style={{
                color: deleteDisabled ? ICONS.DELETE_DISABLED.color : ICONS.DELETE_ENABLED.color,
              }}
              width={ICONS.size}
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
            <Typography
              variant={ICONS.variant}
              color={deleteDisabled ? ICONS.DELETE_DISABLED.color : ICONS.DELETE_ENABLED.color}
            >
              {deleteDisabled ? ICONS.DELETE_DISABLED.heading : ICONS.DELETE_ENABLED.heading}
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
                ? ICONS.VERIFIED.heading
                : ICONS.NOT_VERIFIED.heading
            }
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={
                customerVerificationCount || machineVerificationCount > 0
                  ? ICONS.VERIFIED.heading
                  : ICONS.NOT_VERIFIED.heading
              }
              icon={ICONS.VERIFIED.icon}
              style={{
                color:
                  customerVerificationCount || machineVerificationCount > 0
                    ? ICONS.VERIFIED.color
                    : ICONS.NOT_VERIFIED.color,
              }}
              width={ICONS.size}
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
                variant={ICONS.variant}
                color={
                  customerVerificationCount || machineVerificationCount > 0
                    ? ICONS.VERIFIED.color
                    : ICONS.NOT_VERIFIED.color
                }
              >
                {customerVerificationCount || machineVerificationCount > 0
                  ? ICONS.VERIFIED.heading
                  : ICONS.NOT_VERIFIED.heading}
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
                color: (theme) => alpha(theme.palette.common.white, 0.8),
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.98),
                },
              }}
            >
              <Typography variant={ICONS.badge}>
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
            aria-label={
              documentIsActive ? ICONS.DOCUMENT_ACTIVE.heading : ICONS.DOCUMENT_INACTIVE.heading
            }
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={
                documentIsActive ? ICONS.DOCUMENT_ACTIVE.heading : ICONS.DOCUMENT_INACTIVE.heading
              }
              icon={ICONS.DOCUMENT_ACTIVE.icon}
              style={{
                color: documentIsActive
                  ? ICONS.DOCUMENT_ACTIVE.color
                  : ICONS.DOCUMENT_INACTIVE.color,
              }}
              width={ICONS.size}
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
            <Typography
              variant={ICONS.variant}
              color={documentIsActive ? ICONS.DOCUMENT_ACTIVE.color : ICONS.DOCUMENT_INACTIVE.color}
            >
              {documentIsActive ? ICONS.DOCUMENT_ACTIVE.heading : ICONS.DOCUMENT_INACTIVE.heading}
            </Typography>
          </StyledPopover>
        </>
      )}

       {/* MultiAuth icon */}
       {multiAuth !== undefined && (
        <>
          <IconButton
            aria-label={
              multiAuth ? ICONS.MULTIAUTH_ACTIVE.heading : ICONS.MULTIAUTH_INACTIVE.heading
            }
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={
                multiAuth ? ICONS.MULTIAUTH_ACTIVE.heading : ICONS.MULTIAUTH_INACTIVE.heading
              }
              icon={multiAuth ? ICONS.MULTIAUTH_ACTIVE.icon : ICONS.MULTIAUTH_INACTIVE.icon}
              style={{
                color: multiAuth
                  ? ICONS.MULTIAUTH_ACTIVE.color
                  : ICONS.MULTIAUTH_INACTIVE.color,
              }}
              width={ICONS.size}
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
            <Typography
              variant={ICONS.variant}
              color={multiAuth ? ICONS.MULTIAUTH_ACTIVE.color : ICONS.MULTIAUTH_INACTIVE.color}
            >
              {multiAuth ? ICONS.MULTIAUTH_ACTIVE.heading : ICONS.MULTIAUTH_INACTIVE.heading}
            </Typography>
          </StyledPopover>
        </>
      )}

       {/* currentEmp icon */}
       {currentEmp !== undefined && (
        <>
          <IconButton
            aria-label={
              currentEmp ? ICONS.CURR_EMP_ACTIVE.heading : ICONS.CURR_EMP_INACTIVE.heading
            }
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={
                currentEmp ? ICONS.CURR_EMP_ACTIVE.heading : ICONS.CURR_EMP_INACTIVE.heading
              }
              icon={currentEmp ? ICONS.CURR_EMP_ACTIVE.icon : ICONS.CURR_EMP_INACTIVE.icon}
              style={{
                color: currentEmp
                  ? ICONS.CURR_EMP_ACTIVE.color
                  : ICONS.CURR_EMP_INACTIVE.color,
              }}
              width={ICONS.size}
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
            <Typography
              variant={ICONS.variant}
              color={currentEmp ? ICONS.CURR_EMP_ACTIVE.color : ICONS.CURR_EMP_INACTIVE.color}
            >
              {currentEmp ? ICONS.CURR_EMP_ACTIVE.heading : ICONS.CURR_EMP_INACTIVE.heading}
            </Typography>
          </StyledPopover>
        </>
      )}

      {/* customerAccess icon */}
      {customerAccess !== undefined && (
        <>
          <IconButton
            aria-label={customerAccess ? ICONS.ALLOWED.heading : ICONS.DISALLOWED.heading}
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={customerAccess ? ICONS.ALLOWED.heading : ICONS.DISALLOWED.heading}
              icon={customerAccess ? ICONS.ALLOWED.icon : ICONS.DISALLOWED.icon}
              style={{ color: customerAccess ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color }}
              width={ICONS.size}
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
            <Typography
              variant="overline"
              color={customerAccess ? ICONS.ALLOWED.color : ICONS.DISALLOWED.color}
            >
              {customerAccess ? ICONS.ALLOWED.heading : ICONS.DISALLOWED.heading}
            </Typography>
          </StyledPopover>
        </>
      )}

      {/* map icon sliding tooltip *no bg */}
      {sites && (
        <Button onClick={onMapClick} sx={{ display: { sm: 'block', md: 'none' } }}>
          <IconButton
            aria-label={ICONS.MAP.heading}
            onClick={handlePopoverOpen}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <Iconify
              heading={ICONS.MAP.heading}
              icon={ICONS.MAP.icon}
              style={{ color: ICONS.MAP.color }}
              width={ICONS.size}
            />
          </IconButton>
          <StyledPopover
            open={isPopoverOpen}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
            id="mouse-over-popover"
          >
            <Typography variant={ICONS.variant} color={ICONS.MAP.color}>
              {ICONS.MAP.heading}
            </Typography>
          </StyledPopover>
        </Button>
      )}
    </>
  );
}

IconPopover.propTypes = {
  isActive: PropTypes.bool,
  isRequired: PropTypes.bool,
  deleteDisabled: PropTypes.bool,
  customerVerificationCount: PropTypes.number,
  machineVerificationCount: PropTypes.number,
  verified: PropTypes.bool,
  verifyBadgeClick: PropTypes.func,
  documentIsActive: PropTypes.bool,
  customerAccess: PropTypes.bool,
  sites: PropTypes.array,
  onMapClick: PropTypes.func,
  multiAuth:PropTypes.bool,
  currentEmp:PropTypes.bool
};
