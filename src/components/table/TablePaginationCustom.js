import { memo } from 'react'
import PropTypes from 'prop-types';
// @mui
import { Box, Stack, Switch, TablePagination, FormControlLabel, Pagination } from '@mui/material';

// ----------------------------------------------------------------------

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
};

function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [10, 20,50,100],
  sx,
  ...other
}) {
  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TablePagination rowsPerPageOptions={rowsPerPageOptions} component="div" showLastButton showFirstButton {...other} />
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
