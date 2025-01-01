import PropTypes from 'prop-types';
import {
  TableCell,
  Stack,
} from '@mui/material';
// utils
import { fDateTime } from '../../utils/formatTime';
import { StyledTableRow } from '../../theme/styles/default-styles'
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

TicketFormTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function TicketFormTableRow({
  row,
  selected,
  onViewRow,
}) {

  const { description, priority, impact, share, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected}>
      <Stack direction="row" alignItems="center">
        {/* <LinkTableCell align="left" onClick={onViewRow} param={subject} /> */}
        <TableCell align='left' > { description || ''} </TableCell> 
      </Stack>
      <TableCell align='left' > { priority || ''} </TableCell> 
      <TableCell align='left' > { impact } </TableCell>
      <TableCell align='left' > { share } </TableCell>
      <TableCell align='right' > { fDateTime(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
