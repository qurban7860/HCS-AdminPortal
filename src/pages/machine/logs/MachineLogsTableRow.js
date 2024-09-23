import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'
import { PATH_MACHINE_LOGS } from '../../../routes/paths';

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
  columnsToShow
}) {
  const location = useLocation();
  const { date, machine, frameSet, componentLabel, componentLength, waste, operator, createdAt, createdBy } = row;

  return (
    <StyledTableRow hover selected={selected} onClick={onViewRow} sx={{cursor: 'pointer'}}>
      <LinkTableCell align="left" onClick={onViewRow} param={fDateTime(date)} />
      { location.pathname === PATH_MACHINE_LOGS.root && (<TableCell align="left">{machine?.serialNo || ''}</TableCell>)}
      { location.pathname === PATH_MACHINE_LOGS.root && <TableCell align="left">{frameSet || ''}</TableCell>}
      { location.pathname === PATH_MACHINE_LOGS.root && <TableCell align="left">{componentLabel || ''}</TableCell>}
      { location.pathname === PATH_MACHINE_LOGS.root && <TableCell align="left">{componentLength || ''}</TableCell>}
      { location.pathname === PATH_MACHINE_LOGS.root && <TableCell align="left">{waste || ''}</TableCell>}
      { location.pathname === PATH_MACHINE_LOGS.root && <TableCell align="left">{operator || ''}</TableCell>}
      {columnsToShow?.map((column, index) => {
        if (['date', 'createdBy.name', 'createdAt'].includes(column.id)) return null;
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
