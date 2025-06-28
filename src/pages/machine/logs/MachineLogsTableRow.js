/* eslint-disable no-restricted-globals */
import PropTypes from 'prop-types';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
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
        const columnValue = lowercaseRow?.[column.id.toLocaleLowerCase()] || '';
        const isMeter = column?.baseUnit === 'm';
        const isMiliMeter = column?.baseUnit === 'mm';
        const isKg = column?.baseUnit === 'kg';
        const isNumerical = column?.numerical;
        let cellValue = columnValue || '';
        const value = parseFloat(columnValue);

        if (columnValue && !isNaN(columnValue)) {


          if (unit === 'Imperial' && (isMeter || isMiliMeter)) {
            // Convert mm to inches
            cellValue = (value / 25.4).toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            });
          } else if (unit === 'Metric' && isMeter) {
            // Convert mm to meters
            cellValue = (value / 1000).toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            });
          } else if (unit === 'Imperial' && isKg) {
            // Convert kg to pounds
            cellValue = (value * 2.20462).toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            });
          } else if (isNumerical) {
            // Keep as-is with formatting
            cellValue = value.toLocaleString(undefined, {
              minimumFractionDigits: 3,
              maximumFractionDigits: 3,
            });
          }
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
