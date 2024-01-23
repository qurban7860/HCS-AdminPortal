import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
  Switch,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
// ----------------------------------------------------------------------

NoteListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

export default function NoteListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    note,
    createdAt,
    isActive
  } = row;

  return (
      <StyledTableRow hover selected={selected}>

        <LinkTableCell align="left" param={note} onClick={onViewRow} />
        <TableCell align="center" sx={{width:'100px'}}><Switch checked={isActive} disabled size="small" /></TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>

      </StyledTableRow>

  );
}
