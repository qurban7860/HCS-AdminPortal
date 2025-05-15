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
}) {
  row = { ...row, machineSerialNo: row?.machine?.serialNo };
  const { date } = row;
  const lowercaseRow = {};
  Object.entries(row).forEach(([key, value]) => {
    if (typeof key === 'string') lowercaseRow[key.toLocaleLowerCase()] = value;
  });

  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow} sx={{ cursor: 'pointer' }}>
      <LinkTableCell align="left" onClick={onViewRow} param={fDateTime(date)} />
      {columnsToShow?.map((column, index) => {
        if (['date', 'createdBy.name', 'createdAt'].includes(column.id) || !column?.checked)
          return null;
        const columnValue = lowercaseRow?.[column.id.toLocaleLowerCase()] || '';
        const convertToM = column?.convertToM;
        const isNumerical = column?.numerical;
        let cellValue = columnValue || '';
        if (convertToM) {
          cellValue =
            columnValue !== null && columnValue !== '' && !isNaN(columnValue)
              ? convertMmToM(columnValue).toLocaleString(undefined, {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })
              : columnValue || '';
        } else if (isNumerical) {
          cellValue =
            columnValue !== null && columnValue !== '' && !isNaN(columnValue)
              ? Number(columnValue).toLocaleString(undefined, {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })
              : columnValue || '';
        }
        return (
          <TableCell
            key={index}
            onClick={onViewRow}
            sx={{ cursor: 'pointer' }}
            align={column?.numerical ? 'right' : 'left'}
          >
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
