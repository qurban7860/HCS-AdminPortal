import { memo } from 'react'
import PropTypes from 'prop-types';
// @mui
import { Box, Switch, TablePagination, FormControlLabel, Button } from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
  refresh: PropTypes.func,
};

function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [10, 20,50,100],
  sx,
  refresh,
  ...other
}) {

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination labelRowsPerPage="Rows:" colSpan={2} rowsPerPageOptions={rowsPerPageOptions} component="div" showLastButton showFirstButton {...other} 
      sx={{
        '.MuiTablePagination-toolbar': {
          height: '20px',
          width: '!important 200px',
        },
      }}
      />

      {refresh && (
        <Button sx={{ top: 10, left:25, position: {md: 'absolute',}}} 
          onClick={refresh} variant="outlined"  
          startIcon={<Iconify icon="mdi:reload" />}>
          Reload
        </Button>
      )}

      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            top: 0,
            position: {
              md: 'absolute',
            },
          }}
        />
      )}
    </Box>
  );
}
export default memo(TablePaginationCustom)
