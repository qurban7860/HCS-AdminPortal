import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  Checkbox,
  TableCell,
} from '@mui/material';
// utils
import { fDateTime, fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

HistoricalConfigurationsTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  selectedLength: PropTypes.number,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function HistoricalConfigurationsTableRow({
  row,
  style,
  selected,
  selectedLength,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { backupid, backupDate, isManufacture, isActive, createdAt, createdBy, createdByIdentifier } = row;

  return (
      <StyledTableRow hover selected={selected}>
        <TableCell padding="checkbox" align="left" >
          <Checkbox checked={selected} onClick={ onSelectRow }  />
        </TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={backupid} />
        <TableCell align="center" >{ fDate( backupDate ) }</TableCell>
        <TableCell align="center">
          <Switch checked={isManufacture} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="center">
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="left">  {createdBy?.name || createdByIdentifier?.name || createdByIdentifier || ''}</TableCell>
        <TableCell align="right">{fDateTime(createdAt)}</TableCell>
      </StyledTableRow>
  );
}
