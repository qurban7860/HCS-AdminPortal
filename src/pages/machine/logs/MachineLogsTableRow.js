/* eslint-disable no-restricted-globals */
import PropTypes from 'prop-types';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { convertValue } from '../../../utils/convertUnits';
import { StyledTableRow } from '../../../theme/styles/default-styles';
import { convertMmToM } from '../../../components/Utils/measurementHelpers';
// ----------------------------------------------------------------------

MachineLogsTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  selectedLength: PropTypes.number,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  columnsToShow: PropTypes.array,
  allMachineLogsPage: PropTypes.bool,
  numericalLengthValues: PropTypes.array,
  unit: PropTypes.string,
};

export default function MachineLogsTableRow({
  row,
  style,
  selected,
  selectedLength,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  columnsToShow,
  allMachineLogsPage,
  numericalLengthValues,
  unit,
}) {
  row = { ...row, machineSerialNo: row?.machine?.serialNo };
  const { date } = row;
  const lowercaseRow = {};
  Object.entries(row).forEach(([key, value]) => {
    if (typeof key === 'string') lowercaseRow[key.toLocaleLowerCase()] = value;
  });

  return (
    <StyledTableRow hover selected={selected} sx={{ cursor: 'pointer' }}>
      <LinkTableCell align="left" onClick={onViewRow} param={fDateTime(date)} />
      {columnsToShow?.map((column, index) => {
        if (['date', 'createdBy.name', 'createdAt'].includes(column.id) || !column?.checked) return null;
        const rawValue = lowercaseRow?.[column.id.toLocaleLowerCase()] || ''
        let cellValue = rawValue;

        if (rawValue && column?.baseUnit && !isNaN(rawValue)) {
          const { formattedValue } = convertValue(
            parseFloat(rawValue),
            column?.baseUnit,
            unit,
            true
          );
          cellValue = formattedValue;
        }
        return (
          <TableCell key={index} align={column?.numerical ? 'right' : 'left'}>
            {cellValue}
            {/* {numericalLengthValues.includes(column.id) ? convertMmToM(cellValue) : cellValue} */}
          </TableCell>
        );
      })}
      {/* <TableCell align="left">{createdBy?.name || ''}</TableCell>
      <TableCell align="right">{fDateTime(createdAt)}</TableCell> */}
    </StyledTableRow>
  );
}
