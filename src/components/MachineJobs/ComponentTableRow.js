import PropTypes from 'prop-types';
import { Box, TableCell, TableRow, useTheme } from '@mui/material';

import { useFormContext, useWatch } from 'react-hook-form';
import IconTooltip from '../Icons/IconTooltip';
import LinkTableCell from '../ListTableTools/LinkTableCell';

const ComponentTableRow = ({
  component,
  index,
  setExpanded,
  handleClickOpen,
  setCurrentComponentInfo,
  handleDeleteConfirm,
  handleDuplicateComponent,
}) => {
  const { control, watch } = useFormContext();
  const theme = useTheme();

  const currentLabel = useWatch({ control, name: `components.${index}.label` });
  const currentLabelDir = useWatch({ control, name: `components.${index}.labelDirection` });
  const currentLength = useWatch({ control, name: `components.${index}.length` });
  const currentQuantity = useWatch({ control, name: `components.${index}.quantity` });
  const currentOperations = useWatch({ control, name: `components.${index}.operations` });

  const unitOfLength = watch('unitOfLength');

  const openComponentsDialog = () => {
    setCurrentComponentInfo({ index, id: component.id });
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
    <TableRow
      key={component.id}
      // hover
      // onClick={() => setExpanded(component.id)}
      // sx={{ cursor: 'pointer' }}
    >
      <LinkTableCell align="left" onClick={openComponentsDialog} param={currentLabel} />
      {/* <TableCell component="th" scope="row">
        {currentLabel}
      </TableCell> */}
      <TableCell>{currentLabelDir}</TableCell>
      <TableCell>{`${currentLength} ${getUnitLabel()} / ${currentQuantity}`}</TableCell>
      <TableCell>{currentOperations?.length}</TableCell>
      <TableCell align="right">
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <IconTooltip
            icon="mdi:square-edit-outline"
            title="Edit"
            onClick={() => {
              setCurrentComponentInfo({ index, id: component.id });
              handleClickOpen();
            }}
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
        {/* <IconButton size="small" onClick={() => setExpanded(component.id)}>
                    </IconButton> */}
      </TableCell>
    </TableRow>
  );
};

ComponentTableRow.propTypes = {
  component: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  setExpanded: PropTypes.func.isRequired,
  handleClickOpen: PropTypes.func,
  setCurrentComponentInfo: PropTypes.func,
  handleDeleteConfirm: PropTypes.func,
  handleDuplicateComponent: PropTypes.func,
};

export default ComponentTableRow;
