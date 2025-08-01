import PropTypes from 'prop-types';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// @mui
import { Stack, Grid, TextField, FormControl, MenuItem, IconButton, Autocomplete } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { BUTTONS } from '../../constants/default-constants';
import Iconify from '../../components/iconify';
import { PATH_MACHINE } from '../../routes/paths';
// constants
import { options, StyledTooltip } from '../../theme/styles/default-styles';
import { TextSearchField } from '../../components/ListTableTools';
// ----------------------------------------------------------------------

MachineTableController.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onFilterVerify: PropTypes.func,
  filterVerify: PropTypes.string,
  accountManagerFilter: PropTypes.array,
  setAccountManagerFilter: PropTypes.func,
  setSupportManagerFilter: PropTypes.func,
  supportManagerFilter: PropTypes.object,
  onExportCSV: PropTypes.func,
  onExportLoading: PropTypes.bool,
  isArchived: PropTypes.bool,
};

function MachineTableController({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  onFilterVerify,
  filterVerify,
  accountManagerFilter,
  setAccountManagerFilter,
  supportManagerFilter,
  setSupportManagerFilter,
  onExportCSV,
  onExportLoading,
  isArchived,
}) {
  const navigate = useNavigate();
  const { spContacts } = useSelector((state) => state.contact);
  const toggleAdd = () => {
    navigate(PATH_MACHINE.machines.new);
  };

  return (
    <Stack {...options}>
      <Grid container spacing={1} sx={{ display: 'flex', width: '100%' }}>
        <Grid container spacing={1} sx={{ display: 'flex' }}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <TextSearchField isFiltered={isFiltered} value={filterName} onChange={onFilterName} onClick={onResetFilter} />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Stack alignItems="flex-start">
              <FormControl fullWidth>
                <TextField size="small" name="isVerified" value={filterVerify} label="Status" onChange={onFilterVerify} select fullWidth>
                  <MenuItem key="all" value="all">All</MenuItem>
                  <MenuItem key="transferredDate" value="transferredDate">Transferred</MenuItem>
                  <MenuItem key="verified" value="verified">Verified</MenuItem>
                  <MenuItem key="unverified" value="unverified">Pending Verification</MenuItem>
                </TextField>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Autocomplete
              multiple
              value={accountManagerFilter || []}
              options={spContacts}
              isOptionEqualToValue={(option, val) => option?._id === val?._id}
              getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
              onChange={(event, newValue) => setAccountManagerFilter(newValue)}
              renderOption={(props, option) => <li {...props} key={option?._id}>{`${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}</li>}
              renderInput={(params) => <TextField {...params} size="small" label="Account Manager" />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Autocomplete
              id="controllable-states-demo"
              value={supportManagerFilter || null}
              options={spContacts}
              isOptionEqualToValue={(option, val) => option?._id === val?._id}
              getOptionLabel={(option) => `${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSupportManagerFilter(newValue);
                } else {
                  setSupportManagerFilter(null);
                }
              }}
              renderOption={(props, option) => <li {...props} key={option?._id}>{`${option.firstName ? option.firstName : ''} ${option.lastName ? option.lastName : ''}`}</li>}
              renderInput={(params) => <TextField {...params} size="small" label="Support Manager" />}
            />
          </Grid>
          {!isArchived && (
          <Grid item xs="auto" sx={{ ml: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <LoadingButton onClick={() => onExportCSV(false, false)} variant="contained" sx={{ p: 0, minWidth: '24px' }} loading={onExportLoading}>
              <StyledTooltip title={BUTTONS.EXPORT.label} placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                <Iconify color="#fff" sx={{ height: '41px', width: '55px', p: '8px' }} icon={BUTTONS.EXPORT.icon} />
              </StyledTooltip>
            </LoadingButton>
          </Grid> )}
          {!isArchived && (
          <Grid item>
            <StyledTooltip title={BUTTONS.ADDMACHINE} placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
              <IconButton
                color="#fff"
                onClick={toggleAdd}
                sx={{ background: '#2065D1', borderRadius: 1, height: '1.7em', p: '8.5px 14px',
                  '&:hover': {
                    background: '#103996',
                    color: '#fff',
                  },
                }}
              >
              <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon="eva:plus-fill" />
              </IconButton>
            </StyledTooltip>
          </Grid> )}
        </Grid>
      </Grid>
    </Stack>
  );
}

export default memo(MachineTableController);
