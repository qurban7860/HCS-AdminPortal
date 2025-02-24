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
import { useScreenSize } from '../../../hooks/useResponsive';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

NoteListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
};

export default function NoteListTableRow({
  row,
  selected,
  onViewRow,
  hiddenColumns
}) {


  console.log(row)
  const {
    note,
    updatedAt,
    isActive
  } = row;

  return (
      <StyledTableRow hover selected={selected}>

        <LinkTableCell align="left" param={note} stringLength={100} onClick={onViewRow} />
        { useScreenSize('sm') && !hiddenColumns?.isActive && <TableCell align="center" sx={{width:'100px'}}> <Switch checked={isActive} disabled size="small"/>  </TableCell> }
        <TableCell align="right">{fDate(updatedAt)}</TableCell>

      </StyledTableRow>

  );
}
