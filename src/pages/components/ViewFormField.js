import PropTypes from 'prop-types';
import { useState } from 'react';
// eslint-disable-next-line
import { makeStyles } from '@mui/styles';
import { Typography, Grid, Popover, IconButton } from '@mui/material';
import Iconify from '../../components/iconify';
import useResponsive from '../../hooks/useResponsive';

ViewFormField.propTypes = {
  heading: PropTypes.string,
  param: PropTypes.string,
  numberParam: PropTypes.number,
  secondParam: PropTypes.string,
  objectParam: PropTypes.object,
  secondObjectParam: PropTypes.object,
  sm: PropTypes.number,
  isActive: PropTypes.bool,
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
  customerAccess,
  documentIsActive,
}) {
  const classes = useStyles({ isActive });
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

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
        style={{ display: 'flex', alignItems: 'center' }}
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
                vertical: 'center',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
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
    </Grid>
  );
}
