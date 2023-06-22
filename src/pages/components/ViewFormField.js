import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
// eslint-disable-next-line
import { makeStyles } from '@mui/styles';
import { Typography, Grid, Popover, IconButton, MenuItem , Box, Divider} from '@mui/material';
import {createTheme, ThemeProvider, styled, alpha} from '@mui/material/styles';
import Iconify from '../../components/iconify';
import useResponsive from '../../hooks/useResponsive';
import MenuPopover from '../../components/menu-popover';
import { fDate } from '../../utils/formatTime';

ViewFormField.propTypes = {
  heading: PropTypes.string,
  param: PropTypes.string,
  numberParam: PropTypes.number,
  secondParam: PropTypes.string,
  objectParam: PropTypes.object,
  secondObjectParam: PropTypes.object,
  sm: PropTypes.number,
  isActive: PropTypes.bool,
  customerVerificationCount: PropTypes.number,
  machineVerificationCount: PropTypes.number,
  verified: PropTypes.bool,
  machineVerifiedBy: PropTypes.array,
  customerVerifiedBy: PropTypes.array,
  customerAccess: PropTypes.bool,
  documentIsActive: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
  tooltip: {
    fontSize: '1rem',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  activeHover: {
    display: 'block',
    padding: '0.5rem',
    shadow: 'none',
    fontSize: '1rem',
    cursor: 'point',
    backgroundColor: 'transparent',
    animationName: 'slideIn',
    animation: 'slideIn 0.3s ease-in-out',
    animationDuration: '0.3s',
    animationTimingFunction: 'ease-in-out',
    easing: 'ease-in-out',
    transition: 'all 0.3s ease-in-out',
  },
}));

export default function ViewFormField({
  heading,
  param,
  secondParam,
  objectParam,
  secondObjectParam,
  numberParam,
  sm,
  isActive,
  customerVerificationCount,
  machineVerificationCount,
  verified,
  customerVerifiedBy,
  machineVerifiedBy,
  customerAccess,
  documentIsActive,
}) {
  const classes = useStyles({ isActive });
  const [anchorEl, setAnchorEl] = useState(null);
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [verifiedBy, setVerifiedBy] = useState([]);
  
useEffect(()=>{
  if(customerVerifiedBy){
    setVerifiedBy(customerVerifiedBy)
  }else if(machineVerifiedBy){
    setVerifiedBy(machineVerifiedBy)
  }
},[customerVerifiedBy, machineVerifiedBy]);

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
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const isPopoverOpen = Boolean(anchorEl);
  const { isMobile } = useResponsive();

  return (
    <Grid item xs={12} sm={sm} sx={{ px: 2, py: 1, overflowWrap: 'break-word' }}>
      <Typography variant="overline" sx={{ color: 'text.disabled' }}>
        {heading || ''}
      </Typography>

      <Typography
        variant={
          heading === 'Serial No' ||
          heading === 'Machine Model' ||
          heading === 'Customer' ||
          heading === 'Machine'
            ? 'h4'
            : 'body1'
        }
        style={{ display: 'flex', alignItems: 'center' , whiteSpace: "pre-line",}}
      >
        {isActive !== undefined && (
          <>
            <IconButton
              aria-label={isActive ? 'Active' : 'Inactive'}
              // onClick={handlePopoverOpen}
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
            <Popover
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
              sx={{
                marginTop: '.5rem',
                '& .MuiPaper-root': {
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                },
                boxShadow: 'none',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="overline"
                classes={{ root: classes.activeHover }}
                color={isActive ? 'green' : 'red'}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Typography>
            </Popover>
          </>
        )}
        {(customerVerificationCount || machineVerificationCount > 0 ) && verified > 0  && (
          <>
            <IconButton
              aria-label={customerVerificationCount || machineVerificationCount > 0 ? 'Verified' : 'Not Verified'}
              onClick={handlePopoverOpen}
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              <Iconify
                heading={customerVerificationCount  || machineVerificationCount > 0 ? 'Verified' : 'Not Verified'}
                icon="ic:round-verified-user"
                style={{ color: customerVerificationCount || machineVerificationCount > 0 ? 'green' : 'red' }}
                width="30px"
              />
              <Popover
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
              sx={{
                marginTop: '.5rem',
                '& .MuiPaper-root': {
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                },
                boxShadow: 'none',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="overline"
                classes={{ root: classes.activeHover }}
                color={customerVerificationCount || machineVerificationCount > 0 ? 'green' : 'red'}
              >
                {customerVerificationCount || machineVerificationCount > 0 ? 'Verified' : 'Not Verified'}
              </Typography>
            </Popover>
            <Popover
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
              sx={{
                marginTop: '.5rem',
                '& .MuiPaper-root': {
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                },
                boxShadow: 'none',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="overline"
                classes={{ root: classes.activeHover }}
                color={customerVerificationCount || machineVerificationCount > 0 ? 'green' : 'red'}
              >
                {customerVerificationCount || machineVerificationCount > 0 ? 'Verified' : 'Not Verified'}
              </Typography>
            </Popover>
            </IconButton>
            {(customerVerificationCount || machineVerificationCount) > 0  && 
            <IconButton
                            onClick={handleVerifiedPopoverOpen}
                            size="small"
                            sx={{
                              width: '24px', 
                              height:'24px',
                              bottom: 17,
                              left: -24,
                              // zIndex: 9,
                              // position: 'absolute',
                              color: (themee) => alpha(themee.palette.common.white, 0.8),
                              bgcolor: (themee) => alpha(themee.palette.grey[900], 0.72),
                              '&:hover': {
                                bgcolor: (themee) => alpha(themee.palette.grey[900], 0.98),
                              },
                            }}
                          > 
                            <Typography  variant='body2' >{(customerVerificationCount || machineVerificationCount) > 99 ? 99 : customerVerificationCount || machineVerificationCount }</Typography>
                          </IconButton>}
          </>
        )}
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
            <Popover
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
              sx={{
                marginTop: '.5rem',
                '& .MuiPaper-root': {
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                },
                boxShadow: 'none',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="overline"
                classes={{ root: classes.activeHover }}
                color={documentIsActive ? 'green' : 'red'}
              >
                {documentIsActive ? 'Active' : 'Inactive'}
              </Typography>
            </Popover>
          </>
        )}
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
            <Popover
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
              sx={{
                marginTop: '.5rem',
                '& .MuiPaper-root': {
                  bgcolor: 'transparent',
                  boxShadow: 'none',
                },
                boxShadow: 'none',
                pointerEvents: 'none',
              }}
            >
              <Typography
                variant="overline"
                classes={{ root: classes.activeHover }}
                color={customerAccess ? 'green' : 'red'}
              >
                {customerAccess ? 'Allowed' : 'Disallowed'}
              </Typography>
            </Popover>
          </>
        )}
        {param && param.trim().length > 0 ? param : ''}
        {param && param.trim().length > 0 && secondParam && secondParam.trim().length > 0
          ? '  '
          : ''}
        {secondParam && secondParam.trim().length > 0 ? secondParam : ''}
        {objectParam || ''}
        {secondObjectParam || ''}
        {numberParam || ''}
        &nbsp;
      </Typography>
      {/* <MenuPopover
        open={handleVerifiedPopover}
        // onClose={handleVerifiedPopoverClose}
        arrow="right-top"
        //sx={{ width: 140 }}
      >
        <MenuItem  sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
        </MenuItem>

        <MenuItem>
          <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
        </MenuItem>
      </MenuPopover>  */}
      <MenuPopover open={verifiedAnchorEl} onClose={handleVerifiedPopoverClose} sx={{ p: 0}}>
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Verified By</Typography>
            {verifiedBy?.map((user)=>( 
              <>
              <Divider sx={{ borderStyle: 'solid' }} />
              <Grid display="flex" justifyContent="space-between">
                <Typography variant="body2" sx={{ color: 'text.secondary', mr:3 }}>{user?.verifiedBy?.name || ''}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{fDate(user?.verifiedDate) || ''}</Typography>
              </Grid>
              </>))}
          </Box>
        </Box>
      </MenuPopover>
    </Grid>
  );
}
