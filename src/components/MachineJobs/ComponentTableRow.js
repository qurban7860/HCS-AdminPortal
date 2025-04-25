import PropTypes from 'prop-types';
import { Box, TableCell, TableRow, useTheme } from '@mui/material';

import IconTooltip from '../Icons/IconTooltip';
import LinkTableCell from '../ListTableTools/LinkTableCell';

const ComponentTableRow = ({
  component,
  index,
  unitOfLength,
  handleClickOpen,
  setCurrentComponentIndex,
  setComponentInDialog,
  handleDeleteConfirm,
  handleDuplicateComponent,
}) => {
  const theme = useTheme();

  const openComponentsDialog = () => {
    setCurrentComponentIndex(index);
    setComponentInDialog(component)
    handleClickOpen();
  };

  const getUnitLabel = () => {
    switch (unitOfLength) {
      case 'MILLIMETRE':
        return 'mm';
      case 'INCH':
        return 'in';
      default:
        return 'units';
    }
  };
  return (
    <TableRow key={component.id}>
      <LinkTableCell align="left" onClick={openComponentsDialog} param={component?.label} />
      <TableCell>{component?.labelDirection}</TableCell>
      <TableCell>{`${component?.length} ${getUnitLabel()} / ${component?.quantity}`}</TableCell>
      <TableCell>{component?.operations?.length}</TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconTooltip
            icon="mdi:square-edit-outline"
            title="Edit"
            onClick={openComponentsDialog}
            iconSx={{
              border: 'none',
            }}
          />
          <IconTooltip
            icon="mdi:content-copy"
            title="Duplicate"
            color={theme.palette.secondary.main}
            onClick={() => handleDuplicateComponent(index)}
            iconSx={{
              border: 'none',
              width: '28px',
            }}
          />
          <IconTooltip
            icon="mdi:delete"
            title="Delete"
            color={theme.palette.error.main}
            onClick={() => handleDeleteConfirm(index)}
            iconSx={{
              border: 'none',
            }}
          />
        </Box>
      </TableCell>
    </TableRow>
  );
};

ComponentTableRow.propTypes = {
  component: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  unitOfLength: PropTypes.string.isRequired,
  handleClickOpen: PropTypes.func,
  setCurrentComponentIndex: PropTypes.func,
  setComponentInDialog: PropTypes.func,
  handleDeleteConfirm: PropTypes.func,
  handleDuplicateComponent: PropTypes.func,
};

export default ComponentTableRow;
