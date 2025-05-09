import { memo, useState } from 'react'
import PropTypes from 'prop-types';
// @mui
import { Box, Switch, TablePagination, FormControlLabel, Button, MenuItem, Checkbox, Menu, IconButton } from '@mui/material';
import Iconify from '../iconify';
import { StyledTooltip } from '../../theme/styles/default-styles';

// ----------------------------------------------------------------------

TablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
  columnFilterButtonData: PropTypes.array,
  columnButtonClickHandler: PropTypes.func,
};

function TablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [10, 20,50,100],
  columnFilterButtonData = [],
  columnButtonClickHandler = () => {},
  sx,
  ...other
}) {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleColumnClick = (column) => {
    if (!column.alwaysShow) {
      columnButtonClickHandler(column.id, !column.checked);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
                    {column.label}
                  </MenuItem>
                )
            )}
          </Menu>
        </Box>
      )}
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
export default memo(TablePaginationCustom)
