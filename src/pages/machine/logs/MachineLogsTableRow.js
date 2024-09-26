import PropTypes from 'prop-types';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'

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
  allMachineLogsPage
}) {
  const { date, machine } = row;
  const lowercaseRow = {};
  Object.entries(row).forEach(([key, value]) => {
    if (typeof key === "string") lowercaseRow[key.toLocaleLowerCase()] = value
  })

  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow} sx={{cursor: 'pointer'}}>
      <LinkTableCell align="left" onClick={onViewRow} param={fDateTime(date)} />
      {allMachineLogsPage ? (<TableCell align="left">{machine?.serialNo || ''}</TableCell>) : null}
      {columnsToShow?.map((column, index) => {
        if (['date', 'machineSerialNo', 'createdBy.name', 'createdAt'].includes(column.id)) return null;
        return (
          <TableCell key={index} align={column.align} onClick={onViewRow} sx={{cursor: 'pointer'}}>
            {lowercaseRow?.[column.id.toLocaleLowerCase()] || ''}
          </TableCell>
        );
      })}
      {/* <TableCell align="left">{createdBy?.name || ''}</TableCell>
      <TableCell align="right">{fDateTime(createdAt)}</TableCell> */}
    </StyledTableRow>
  );
}
