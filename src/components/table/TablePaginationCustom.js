import { memo, useState } from 'react'
import PropTypes from 'prop-types';
// @mui
import { Box, Switch, TablePagination, FormControlLabel, Button, MenuItem, Checkbox, Menu, Divider } from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

TablePaginationFilter.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
  columnFilterButtonData: PropTypes.array,
  columnButtonClickHandler: PropTypes.func,
  allColumnsSelectHandler: PropTypes.func,
  customNode: PropTypes.node
};

function TablePaginationFilter({
  dense,
  onChangeDense,
  rowsPerPageOptions = [10, 20, 50, 100],
  columnFilterButtonData = [],
  columnButtonClickHandler = () => {},
  allColumnsSelectHandler = () => {},
  sx,
  customNode = null,
  ...other
}) {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleColumnClick = (column) => {
    if (!column.alwaysShow) {
      columnButtonClickHandler(column.id, !column.checked);
    }
  };

  const handleSelectAllColumns = () => {
    if (allColumnsSelectHandler) {
      allColumnsSelectHandler();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Check if all selectable columns are checked
  const selectableColumns = columnFilterButtonData.filter(col => !col.alwaysShow);
  const allSelectableChecked = selectableColumns.length > 0 && selectableColumns.every(col => col.checked);

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderTop: '1px solid rgba(224, 224, 224, 1)',
        ...sx,
      }}
    >
      {columnFilterButtonData?.length > 0 && (
        <Box sx={{ flexGrow: 1, pl: 2 }}>
          <Button
            startIcon={<Iconify icon="flowbite:column-solid" />}
            variant='outlined'
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            Columns
          </Button>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={handleClose}
            PaperProps={{
              style: {
                width: '20ch',
                maxHeight: 300,
                overflowY: 'auto',
              },
            }}
          >
            {allColumnsSelectHandler && (
              <>
                <MenuItem
                  dense
                  sx={{ p: 0 }}
                  onClick={handleSelectAllColumns}
                >
                  <Checkbox checked={allSelectableChecked} />
                  Select All
                </MenuItem>
                <Divider />
              </>
            )}
            {columnFilterButtonData?.map(
              (column) =>
              (
                <MenuItem
                  dense
                  sx={{ p: 0 }}
                  key={column.id}
                  onClick={() => handleColumnClick(column)}
                >
                  <Checkbox checked={column.checked} disabled={column?.alwaysShow} />
                  {column?.fullLabel || column?.label || ''} {column?.baseUnit && <span style={{ paddingLeft: '4px' }}> ({column?.baseUnit || ''})</span>}
                </MenuItem>
              )
            )}
          </Menu>
        </Box>
      )}
      {customNode && customNode}
      <TablePagination
        labelRowsPerPage="Rows:"
        colSpan={2}
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        showLastButton
        showFirstButton
        {...other}
        sx={{
          '.MuiTablePagination-toolbar': {
            height: '20px',
            width: '!important 200px',
          },
          borderTop: 'none',
        }}
      />
      {onChangeDense && (
        <FormControlLabel
          label="Dense"
          control={<Switch checked={dense} onChange={onChangeDense} />}
          sx={{
            pl: 2,
            py: 1.5,
            position: {
              md: 'absolute',
              right: 0,
            },
          }}
        />
      )}
    </Box>
  );
}
export default memo(TablePaginationFilter)
