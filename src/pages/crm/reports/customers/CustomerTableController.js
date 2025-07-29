import PropTypes from 'prop-types';
import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, Grid, TextField, FormControl, MenuItem, InputLabel, Select, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { BUTTONS } from '../../../../constants/default-constants';
import Iconify from '../../../../components/iconify';
import { PATH_CRM } from '../../../../routes/paths';
// constants
import { options, StyledTooltip } from '../../../../theme/styles/default-styles';
import { TextSearchField } from '../../../../components/ListTableTools';
// ----------------------------------------------------------------------

CustomerTableController.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onFilterVerify: PropTypes.func,
  filterVerify: PropTypes.string,
  filterExcludeRepoting: PropTypes.string,
  handleExcludeRepoting: PropTypes.func,
  onExportCSV: PropTypes.func,
  onExportLoading: PropTypes.bool,
  isArchived: PropTypes.bool,
};

function CustomerTableController({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  onFilterVerify,
  filterVerify,
  filterExcludeRepoting,
  handleExcludeRepoting,
  onExportCSV,
  onExportLoading,
  isArchived,
}) {
  const navigate = useNavigate();
  const toggleAdd = () => {
    navigate(PATH_CRM.customers.new);
  };

  return (
    <Stack {...options}>
      <Grid container spacing={1} sx={{ display: 'flex', width: '100%' }}>
        <Grid container spacing={1} sx={{ display: 'flex' }}>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <TextSearchField isFiltered={isFiltered} value={filterName} onChange={onFilterName} onClick={onResetFilter} />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Stack alignItems="flex-start">
              <FormControl fullWidth>
                <TextField size="small" name="isVerified" value={filterVerify} label="Status" onChange={onFilterVerify} select fullWidth>
                  <MenuItem key="all" value="all">
                    All
                  </MenuItem>
                  <MenuItem key="verified" value="verified">
                    Verified
                  </MenuItem>
                  <MenuItem key="unverified" value="unverified">
                    Pending Verification
                  </MenuItem>
                </TextField>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={2} xl={2}>
            <Stack alignItems="flex-start">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Reporting</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  name="Reporting"
                  value={filterExcludeRepoting}
                  label="Reporting"
                  onChange={handleExcludeRepoting}
                >
                  <MenuItem key="all" value="all">
                    All
                  </MenuItem>
                  <MenuItem key="excluded" value="excluded">
                    Exclude Reporting
                  </MenuItem>
                  <MenuItem key="included" value="included">
                    Include Reporting
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          <Grid item xs="auto" sx={{ ml: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <LoadingButton onClick={() => onExportCSV(false, false)} variant="contained" sx={{ p: 0, minWidth: '24px' }} loading={onExportLoading}>
              <StyledTooltip title={BUTTONS.EXPORT.label} placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                <Iconify color="#fff" sx={{ height: '41px', width: '55px', p: '8px' }} icon={BUTTONS.EXPORT.icon} />
              </StyledTooltip>
            </LoadingButton>
          </Grid>

          <Grid item>
            <StyledTooltip title={!isArchived ? BUTTONS.ADDCUSTOMER : undefined} placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
              <IconButton
                color="#fff"
                onClick={!isArchived ? toggleAdd : undefined}
                sx={{
                  background: '#2065D1',
                  borderRadius: 1,
                  height: '1.7em',
                  p: '8.5px 14px',
                  '&:hover': {
                    background: '#103996',
                    color: '#fff',
                  },
                }}
              >
                <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon="eva:plus-fill" />
              </IconButton>
            </StyledTooltip>
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default memo(CustomerTableController);
