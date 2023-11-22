import React from 'react';
import PropTypes from 'prop-types';
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import { Grid, TextField, InputAdornment, Button, Stack, FormControl, Select, InputLabel, MenuItem, IconButton } from '@mui/material';
import { BUTTONS } from '../../../constants/default-constants';
import Iconify from '../../../components/iconify';
import useResponsive from '../../../hooks/useResponsive';
import IconTooltip from '../Icons/IconTooltip';
import { StyledTooltip } from '../../../theme/styles/default-styles';


function SearchBarCombo({
  isFiltered,
  value,
  onFilterVerify,
  filterVerify,
  signInLogsFilter,
  onSignInLogsFilter,
  onChange,
  onClick,
  SubOnClick,
  addButton,
  inviteOnClick,
  inviteButton,
  buttonIcon,
  transferredMachine,
  ...other
}) {

  const theme = createTheme({
    palette: {
      success: green,
    },
  });
  const isMobile = useResponsive('sm', 'down');
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{display:'flex', justifyContent:'space-between'}}>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
        <TextField
          fullWidth
          value={value}
          onChange={onChange}
          size="small"
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify  icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (isFiltered && (
              <InputAdornment position="end">
                <Button fullWidth onClick={onClick} color='error'size='small' startIcon={<Iconify icon='eva:trash-2-outline' />}>
                  {BUTTONS.CLEAR}
                </Button>
              </InputAdornment>
            )
            ),
          }}
        />
      </Grid>
        {onFilterVerify &&
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Stack alignItems="flex-start">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size='small'
                name="isVerified"
                value={filterVerify}
                label="Verified"
                onChange={onFilterVerify}
              >
                <MenuItem key="all" value="all">All</MenuItem>
                <MenuItem key="verified" value="verified">Verified</MenuItem>
                <MenuItem key="unverified" value="unverified">Not Verified</MenuItem>
                </Select>
            </FormControl>
            </Stack>
          </Grid>
        }

        {onSignInLogsFilter &&
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
            <Stack alignItems="flex-start">
            <FormControl fullWidth={isMobile} sx={{ml:2, width:'200px'}}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                sx={{width:'200px'}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={signInLogsFilter}
                label="Status"
                onChange={onSignInLogsFilter}
              >
                <MenuItem key="-1" value={-1}>All</MenuItem>
                <MenuItem key="200" value={200}>Success</MenuItem>
                <MenuItem key="401" value={401}>Failed</MenuItem>
                </Select>
            </FormControl>
            </Stack>
          </Grid>
        }
          <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                  <Grid container rowSpacing={1} columnSpacing={2} sx={{display:'flex', justifyContent:'flex-end'}}>
                      {inviteButton && 
                        <Grid item>
                          <StyledTooltip title={inviteButton} placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                            <IconButton onClick={inviteOnClick} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                              '&:hover': {
                                background:"#103996", 
                                color:"#fff"
                              }
                            }}>
                              <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon={buttonIcon || 'mdi:user-plus'} />
                            </IconButton>
                          </StyledTooltip>
                        </Grid>
                    }
                    {addButton &&
                        <Grid item>
                          <StyledTooltip title={addButton} placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                          <IconButton onClick={SubOnClick} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                            '&:hover': {
                              background:"#103996", 
                              color:"#fff"
                            }
                          }}>
                            <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon={buttonIcon || 'eva:plus-fill'} />
                          </IconButton>
                        </StyledTooltip>
                      </Grid>
                    }
                  </Grid>
        </Grid>
    </Grid>
  );
}

SearchBarCombo.propTypes = {
  isFiltered: PropTypes.bool,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.string,
  SubOnClick: PropTypes.func,
  addButton: PropTypes.string,
  inviteOnClick: PropTypes.func,
  inviteButton: PropTypes.string,
  buttonIcon: PropTypes.string,
  onFilterVerify:PropTypes.func,
  filterVerify:PropTypes.string,
  signInLogsFilter:PropTypes.number,
  onSignInLogsFilter:PropTypes.func,
  transferredMachine:PropTypes.bool
};

export default SearchBarCombo;
