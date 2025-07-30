import { memo, useState } from 'react'
import PropTypes from 'prop-types';
// @mui
import { Box, TablePagination, Button, MenuItem, Checkbox, Menu, Typography } from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 48;

TablePaginationFilter.propTypes = {
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  columns: PropTypes.array,
  hiddenColumns: PropTypes.object,
  handleHiddenColumns: PropTypes.func,
  sx: PropTypes.object,
  disablePagination: PropTypes.bool,
  recordCount: PropTypes.number,
};

function TablePaginationFilter({
  columns = [],
  hiddenColumns,
  handleHiddenColumns,
  sx,
  disablePagination = false,
  recordCount,
  rowsPerPageOptions = [10, 20, 50, 100],
  ...other
}) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(columns?.filter(head => hiddenColumns[head?.id]));
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColumnClick = (column) => {
    setSelectedColumns((prevSelectedColumns) => {
      const isSelected = prevSelectedColumns?.some((item) => item.id === column.id);

      // Toggle column selection
      const newSelectedColumns = isSelected
        ? prevSelectedColumns.filter((item) => item.id !== column.id)
        : [...prevSelectedColumns, column];

      // Compute new hidden columns
      const newHiddenColumns = {};
      columns?.forEach((col) => {
        if (col?.hideable !== false) {
          newHiddenColumns[col.id] = newSelectedColumns?.some((sel) => sel.id === col.id);
        }
      });

      // Dispatch the action with the new hidden columns
      handleHiddenColumns(newHiddenColumns);

      // Return the new state
      return newSelectedColumns;
    });
  };

  return (
    <Box sx={{
      borderTop: '1px solid #919eab3d',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      px: 1, py: 0
    }}>
      {columns?.length > 0 && <Box>
        <Button size='small' startIcon={<Iconify icon='flowbite:column-solid' />} variant='text' onClick={handleClick}>Columns</Button>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          {columns?.map((column) => column?.hideable !== false && (
            <MenuItem dense sx={{ p: 0 }} key={column.id} onClick={() => handleColumnClick(column)}>
              <Checkbox checked={!selectedColumns?.some((col) => col?.id === column?.id)} />
              {column?.tooltip || column?.label ||""}
            </MenuItem>
          ))}
        </Menu>
      </Box>}
      {!disablePagination && <TablePagination labelRowsPerPage="Rows:" colSpan={2} rowsPerPageOptions={rowsPerPageOptions} component="div" showLastButton showFirstButton {...other}
        sx={{
          ml: 'auto',
          borderTop: 'none !important',
          minHeight: '36px',
          '.MuiTablePagination-toolbar': {
            minHeight: 36,
            height: 36,
            px: 1,
          },
        }}
      />}
      {disablePagination && <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {recordCount} record{recordCount > 1 ? 's' : ''} found
      </Typography>}
    </Box>
  );
}
export default memo(TablePaginationFilter)
