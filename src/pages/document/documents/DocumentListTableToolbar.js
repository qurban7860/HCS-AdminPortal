import PropTypes from 'prop-types';
import { sentenceCase } from 'change-case';
// @mui
import {
  Stack,
  Button,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  Grid,
  Box,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../redux/store';
// components
import Iconify from '../../../components/iconify';
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../routes/paths';
import { setDocumentFormVisibility } from '../../../redux/slices/document/document';


// ----------------------------------------------------------------------

DocumentListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterStatus: PropTypes.array,
  onFilterStatus: PropTypes.func,
  statusOptions: PropTypes.array,
  customerDocList: PropTypes.bool,
  machineDocList: PropTypes.bool,

};

export default function DocumentListTableToolbar({
  isFiltered,
  filterName,
  filterStatus,
  onFilterName,
  statusOptions,
  onResetFilter,
  onFilterStatus,
  customerDocList, 
  machineDocList,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleAdd = () => {
      if(customerDocList || machineDocList){
        dispatch(setDocumentFormVisibility(true));
      }else{
        navigate(PATH_DOCUMENT.document.new); 
      }
    };
  return (
    <Stack spacing={2} alignItems="center" direction={{ xs: 'column', md: 'row', }} sx={{ px: 2.5, py: 3 }} >
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} sm={9} sx={{display: 'inline-flex',}}>
          <TextField fullWidth value={filterName} onChange={onFilterName} placeholder="Search..." InputProps={{ startAdornment: (
            <InputAdornment position="start"> <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} /> </InputAdornment> ), }} />
          {isFiltered && (
            <Button color="error" sx={{ flexShrink: 0, ml:1}} onClick={onResetFilter} startIcon={<Iconify icon="eva:trash-2-outline" />} >Clear</Button>
          )}
        </Grid>
          <Grid item xs={8} sm={3}>
            <Stack alignItems="flex-end" > 
              <Button sx={{p:2}} onClick={toggleAdd} variant="contained" startIcon={ <Iconify icon="eva:plus-fill" /> } >Add Document</Button>
            </Stack>
          </Grid>
      </Grid>
    </Stack>
  );
}
