import PropTypes from 'prop-types';
import { useState } from 'react';
// eslint-disable-next-line
import { makeStyles } from '@mui/styles'
import { Typography, Grid, Popover, IconButton } from '@mui/material';
import Iconify from '../../components/iconify';

ViewFormField.propTypes = {
    heading: PropTypes.string,
    param: PropTypes.string,
    numberParam: PropTypes.number,
    secondParam: PropTypes.string,
    objectParam: PropTypes.object,
    secondObjectParam: PropTypes.object,
    sm: PropTypes.number,
    isActive: PropTypes.bool
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
    backgroundColor: 'transparent',
    }
 }));

export default function ViewFormField({heading,param, secondParam ,objectParam,secondObjectParam, numberParam , sm, isActive}) {
  const classes = useStyles({ isActive });
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const isPopoverOpen = Boolean(anchorEl);

    return (
      <Grid item xs={12} sm={sm} sx={{ px: 2, py: 1, overflowWrap: 'break-word' }}>
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>
          {heading || ''}
        </Typography>

        <Typography
          variant={
            heading === 'Serial No' || heading === 'Machine Model' || heading === 'Customer'
              ? 'h4'
              : 'body1'
          }
          style={{ display: 'flex', alignItems: 'center' }}
          >
          {isActive !== undefined && (
            <>
              <IconButton
                aria-label={isActive ? 'Active' : 'Inactive'}
                onClick={handlePopoverOpen}
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                >
                <Iconify
                  heading={isActive ? 'Active' : 'Inactive'}
                  icon={isActive ? 'mdi:account-badge' : 'mdi:account-cancel-outline'}
                  style={{ color: isActive ? 'green' : 'red'}}
                  width="30px"
                />
              </IconButton>
              <Popover
                open={isPopoverOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'left',
                }}
                id="mouse-over-popover"
                sx={{
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