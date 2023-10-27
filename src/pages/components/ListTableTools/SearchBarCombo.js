import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, InputAdornment, Button, Stack, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { BUTTONS } from '../../../constants/default-constants';
import Iconify from '../../../components/iconify';
import useResponsive from '../../../hooks/useResponsive';

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

  const isMobile = useResponsive('sm', 'down');
  return (
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{display:'flex', justifyContent:'space-between'}}>
      <Grid item xs={12} sm={onFilterVerify || onSignInLogsFilter ?6:8}>
        <TextField
          fullWidth
          value={value}
          onChange={onChange}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify  icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: (isFiltered && (
              <InputAdornment position="end">
                <Button fullWidth onClick={onClick} color='error' startIcon={<Iconify icon='eva:trash-2-outline' />}>
                  {BUTTONS.CLEAR}
                </Button>
              </InputAdornment>
            )
            ),
          }}
        />
      </Grid>
        {onFilterVerify && 
          <Grid item xs={12} sm={4}>
            <Stack alignItems="flex-start">
            <FormControl fullWidth={isMobile} sx={{ml:2, width:'200px'}}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                sx={{width:'200px'}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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
          <Grid item xs={12} sm={4}>
            <Stack alignItems="flex-start">
            <FormControl fullWidth={isMobile} sx={{ml:2, width:'200px'}}>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                sx={{width:'200px'}}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
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

        {inviteButton && <Grid item xs={12} md={2}>
          <Stack alignItems="flex-end">
            <Button
              fullWidth
              sx={{ p: 2}}
              onClick={inviteOnClick}
              variant="contained"
              startIcon={<Iconify icon={buttonIcon || 'eva:plus-fill'} />}
            >
              {inviteButton}
            </Button>
          </Stack>
        </Grid>}
        {addButton && <Grid item xs={12} sm={2}>
          <Stack alignItems="flex-end">
            <Button
              disabled={transferredMachine}
              fullWidth
              sx={{ p: 2}}
              onClick={SubOnClick}
              variant="contained"
              startIcon={<Iconify icon={buttonIcon || 'eva:plus-fill'} />}
            >
              {addButton}
            </Button>
          </Stack>
        </Grid>}
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
