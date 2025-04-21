import PropTypes from 'prop-types';
import { TableCell, TableRow } from '@mui/material';

import { useFormContext, useWatch } from 'react-hook-form';
import IconTooltip from '../Icons/IconTooltip';

const ComponentTableRow = ({ component, index, setExpanded }) => {
  const { control, watch } = useFormContext();

  const currentLabel = useWatch({ control, name: `components.${index}.label` });
  const currentLabelDir = useWatch({ control, name: `components.${index}.labelDirection` });
  const currentLength = useWatch({ control, name: `components.${index}.length` });
  const currentQuantity = useWatch({ control, name: `components.${index}.quantity` });
  const currentOperations = useWatch({ control, name: `components.${index}.operations` });

  const unitOfLength = watch('unitOfLength');

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
      <TableCell component="th" scope="row">
        {currentLabel}
      </TableCell>
      <TableCell>{currentLabelDir}</TableCell>
      <TableCell align="right">
        {currentLength} {getUnitLabel()}
      </TableCell>
      <TableCell align="right">{currentQuantity}</TableCell>
      <TableCell align="right">{currentOperations?.length}</TableCell>
      <TableCell align="right">
        <IconTooltip
          icon="mdi:square-edit-outline"
          title="Edit"
          onClick={() => setExpanded(component.id)}
          iconSx={{
            border: 'none',
          }}
        />
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
};

export default ComponentTableRow;
