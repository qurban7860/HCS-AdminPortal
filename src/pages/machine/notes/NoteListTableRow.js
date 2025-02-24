import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
  Switch,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'

NoteListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};


export default function NoteListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    note,
    updatedAt,
    isActive
  } = row;

  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={note} stringLength={100} onClick={onViewRow} />
        <TableCell align="left"><Switch checked={isActive} disabled size="small" /></TableCell>
        <TableCell align="right">{fDate(updatedAt)}</TableCell>
      </StyledTableRow>

  );
}
