import PropTypes from 'prop-types';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Stack, InputAdornment, TextField, MenuItem, Button ,Grid} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { PATH_DASHBOARD } from '../../routes/paths';
import { setSecurityUserFormVisibility} from '../../redux/slices/securityUser/securityUser';
import { useDispatch} from '../../redux/store';

// ----------------------------------------------------------------------

SecurityUserTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  filterRole: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterRole: PropTypes.func,
  onResetFilter: PropTypes.func,
  optionsRole: PropTypes.arrayOf(PropTypes.string),
};

export default function SecurityUserTableToolbar({
  isFiltered,
  filterName,
  filterRole,
  optionsRole,
  onFilterName,
  onFilterRole,
  onResetFilter,
}) {
  const dispatch = useDispatch();
  const formVisibleToggle = ()=>{
    dispatch(setSecurityUserFormVisibility(true));
  }
  return (
    <Stack
      spacing={2}
      alignItems="center"
      direction={{
        xs: 'column',
        sm: 'row',
      }}
      sx={{ px: 2.5, py: 3 }}
    >
      {/* <TextField
        fullWidth
        select
        label="Role"
        value={filterRole}
        onChange={onFilterRole}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              sx: {
                maxHeight: 260,
              },
            },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsRole.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField> */}
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={9} sx={{display: 'inline-flex',}}>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth value={filterName} onChange={onFilterName} placeholder="Search..." InputProps={{ startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment> ),}}/>
          </Grid>
          {isFiltered && (<Button color="error" sx={{ flexShrink: 0 , ml:1}} onClick={onResetFilter} startIcon={<Iconify icon="eva:trash-2-outline" />} > Clear </Button>)}
        </Grid>
        <Grid item xs={8} sm={3}>
          <Stack alignItems="flex-end" > 
            <Button component={RouterLink} sx={{p:2, px:4}} onClick={formVisibleToggle} to={PATH_DASHBOARD.user.new} variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} > User</Button>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
