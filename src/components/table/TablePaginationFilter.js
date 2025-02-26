import { memo, useState } from 'react'
import PropTypes from 'prop-types';
// @mui
import { Box, TablePagination, Button, Grid, MenuItem, Checkbox, Menu, IconButton, Typography } from '@mui/material';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';


// ----------------------------------------------------------------------

const ITEM_HEIGHT = 48;

TablePaginationFilter.propTypes = {
  pagination: PropTypes.bool,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  columns: PropTypes.array,
  hiddenColumns: PropTypes.object,
  handleHiddenColumns: PropTypes.func,
  sx: PropTypes.object,
  handleFullScreen: PropTypes.func,
  count: PropTypes.number,
};

function TablePaginationFilter({
  pagination = true,
  rowsPerPageOptions = [10, 20, 50, 100],
  columns,
  hiddenColumns,
  handleHiddenColumns,
  sx,
  handleFullScreen,
  count,
  ...other
}) {
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(columns.filter(head => hiddenColumns[head.id]));
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColumnClick = (column) => {
    setSelectedColumns((prevSelectedColumns) => {
      const isSelected = prevSelectedColumns.some((item) => item.id === column.id);

      // Toggle column selection
      const newSelectedColumns = isSelected
        ? prevSelectedColumns.filter((item) => item.id !== column.id)
        : [...prevSelectedColumns, column];

      // Compute new hidden columns
      const newHiddenColumns = {};
      columns.forEach((col) => {
        if (col?.hideable !== false) {
          newHiddenColumns[col.id] = newSelectedColumns.some((sel) => sel.id === col.id);
        }
      });

      // Dispatch the action with the new hidden columns
      handleHiddenColumns(newHiddenColumns);

      // Return the new state
      return newSelectedColumns;
    });
  };

  return (
    <Box display="flex" alignItems="center" sx={{ borderTop: '1px solid #919eab3d', py: 1, px: 2 }}>
      <Button startIcon={<Iconify icon='flowbite:column-solid' />} variant={selectedColumns.length === 0 ? "" : "outlined"} onClick={handleClick}>Columns</Button>
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
        {columns.map((column) => column?.hideable !== false && (
          <MenuItem dense sx={{ p: 0 }} key={column.id} onClick={() => handleColumnClick(column)}>
            <Checkbox checked={!selectedColumns.some((col) => col.id === column.id)} />
            {column.label}
          </MenuItem>
        ))}
      </Menu>
      {/* full screen dialogue box toggle button */}
      <Box sx={{ flexGrow: 1 }} />
      {pagination && <TablePagination labelRowsPerPage="Rows:" colSpan={2} rowsPerPageOptions={rowsPerPageOptions} component="div" showLastButton showFirstButton {...other} 
        sx={{
          borderTop: 'none !important',
          '.MuiTablePagination-toolbar': {
            height: '20px',
            width: '!important 200px',
          },
        }}
      />} 
      {!pagination && count && <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {count} rows
      </Typography>}
      {/* <StyledTooltip
        title="Full Screen"
        placement="top"
        disableFocusListener
        tooltipcolor="#103996"
        color="#103996"
      >
        <IconButton
          onClick={handleFullScreen}
          color="#fff"
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
          <Iconify
            color="#fff"
            sx={{ height: '24px', width: '24px' }}
            icon="icon-park-outline:full-screen-two"
          />
        </IconButton>
      </StyledTooltip> */}
    </Box>
  );
}
export default memo(TablePaginationFilter)
