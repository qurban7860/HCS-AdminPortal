import { memo, useState } from 'react'
import PropTypes from 'prop-types';
// @mui
import { Box, Switch, TablePagination, FormControlLabel, Button, MenuItem, Checkbox, Menu, Divider } from '@mui/material';
import Iconify from '../../../components/iconify';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';

// ----------------------------------------------------------------------

MachineLogsDataTablePaginationCustom.propTypes = {
  dense: PropTypes.bool,
  onChangeDense: PropTypes.func,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  sx: PropTypes.object,
  columnFilterButtonData: PropTypes.array,
  columnButtonClickHandler: PropTypes.func,
  allColumnsSelectHandler: PropTypes.func,
  unitType: PropTypes.string,
};

function MachineLogsDataTablePaginationCustom({
  dense,
  onChangeDense,
  rowsPerPageOptions = [10, 20, 50, 100],
  columnFilterButtonData = [],
  columnButtonClickHandler = () => {},
  allColumnsSelectHandler = () => {},
  sx,
  unitType,
  ...other
}) {

  const [anchorEl, setAnchorEl] = useState(null);
  const numericalLengthValues = machineLogTypeFormats[0]?.numericalLengthValues || [];
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

    const getFormattedLabel = (column, activeUnit) => {
      const { fullLabel, label, baseUnit } = column;
      // If the column is not a numerical length, return label as-is
      if (!numericalLengthValues.includes(column.id)) return fullLabel || label;
      // Metric Length
      if (activeUnit === 'Metric' && 'mm'.includes(baseUnit?.toLowerCase())) {
        return `${fullLabel || label} (${baseUnit})`;
      }
      // Imperial Length
      if (activeUnit === 'Imperial' && 'mm'.includes(baseUnit?.toLowerCase())) {
        return `${fullLabel || label} (in)`;
      }
      // // Imperial Weight
      if (activeUnit === 'Imperial' && baseUnit?.toLowerCase() === 'kg') {
        return `${fullLabel || label} (lbs)`;
      }
      // Fallback to baseUnit or just label
      return baseUnit ? `${fullLabel || label} (${baseUnit})` : (fullLabel || label);
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
                  {getFormattedLabel(column, unitType)}
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
export default memo(MachineLogsDataTablePaginationCustom)
