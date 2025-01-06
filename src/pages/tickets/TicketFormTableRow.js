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

  const { customer, machine, issueType, summary, priority, impact, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected}>
      <TableCell align="left">{customer?.name || ''}</TableCell>
      <TableCell align='left' > { machine?.serialNo || ''} </TableCell> 
      <TableCell align='left' > { issueType || ''} </TableCell> 
      <Stack direction="row" alignItems="center">
        {/* <LinkTableCell align="left" onClick={onViewRow} param={subject} /> */}
        <TableCell align='left' > { summary || ''} </TableCell> 
      </Stack>
      <TableCell align='left' > { priority || ''} </TableCell> 
      <TableCell align='left' > { impact || ''} </TableCell>
      <TableCell align='right' > { fDateTime(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
