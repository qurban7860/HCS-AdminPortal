import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import { Stack, Button, Select, MenuItem, Checkbox, TextField, InputLabel, FormControl, OutlinedInput, InputAdornment, Grid, } from '@mui/material';
// components
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

CustomerListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
};

export default function CustomerListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
}) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      {/* <FormControl
        sx={{
          width: { xs: 1, md: 240 },
        }}
      >
        <InputLabel sx={{ '&.Mui-focused': { color: 'text.primary' } }}>Status</InputLabel>
        <Select
          multiple
          value={filterStatus}
          onChange={onFilterStatus}
          input={<OutlinedInput label="Status" />}
          renderValue={(selected) => selected.map((value) => sentenceCase(value)).join(', ')}
        >
          {statusOptions.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                p: 0,
                mx: 1,
                borderRadius: 0.75,
                typography: 'body2',
                textTransform: 'capitalize',
              }}
            >
              <Checkbox disableRipple size="small" checked={filterStatus.includes(option.value)} />
              {option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={9} sx={{display: 'inline-flex',}}>
        {/* <Grid item xs={12} sm={8}> */}

          <TextField
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          />
        {/* </Grid> */}

      {isFiltered && (
        <Button
          color="error"
          sx={{ flexShrink: 0 }}
          onClick={onResetFilter}
          startIcon={<Iconify icon="eva:trash-2-outline" />}
        >
          Clear
        </Button>
      )}
        </Grid>
        <Grid item xs={8} sm={3}>
          <Stack alignItems="flex-end" > 
            <Button sx={{p:2}}
                variant="contained"
                startIcon={ <Iconify icon="eva:plus-fill" /> }
                >
                Add Machine 
            </Button>
          </Stack>
        </Grid>
      </Grid>
      
      
    </Stack>
  );
}
