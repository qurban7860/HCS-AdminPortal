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

  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow} sx={{cursor: 'pointer'}}>
      <LinkTableCell align="left" onClick={onViewRow} param={fDateTime(date)} />
      {allMachineLogsPage ? (<TableCell align="left">{machine?.serialNo || ''}</TableCell>) : null}
      {columnsToShow?.map((column, index) => {
        if (['date', 'machineSerialNo', 'createdBy.name', 'createdAt'].includes(column.id)) return null;
        return (
          <TableCell key={index} align={column.align} onClick={onViewRow} sx={{cursor: 'pointer'}}>
            {row?.[column.id] || ''}
          </TableCell>
        );
      })}
      {/* <TableCell align="left">{createdBy?.name || ''}</TableCell>
      <TableCell align="right">{fDateTime(createdAt)}</TableCell> */}
    </StyledTableRow>
  );
}
