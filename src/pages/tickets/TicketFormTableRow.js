import PropTypes from 'prop-types';
import {
  TableCell,
  Stack,
  Typography
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
import { StyledTableRow } from '../../theme/styles/default-styles'
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import PriorityIcon from '../calendar/utils/PriorityIcon';
import IssueTypeIcon from './utils/IssueTypeIcon';

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

  const { ticketNo, customer, machine, issueType, summary, priority, status, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" onClick={() => onViewRow( ticketNo )} param={ticketNo || ''} />
      <TableCell align='left' > { machine?.serialNo || ''} </TableCell>
      <Stack direction="row" alignItems="center">
        <TableCell align='left' > { summary || ''} </TableCell> 
      </Stack>
      <LinkTableCell align="left" padding="checkbox" onClick={onViewRow} param={customer?.name || ''} /> 
      <TableCell align="left" padding="checkbox">
        <IssueTypeIcon issueType={issueType} />
      </TableCell>
      <TableCell align="left" padding="checkbox">
        <Typography variant='subtitle2' sx={{mr: 1,
          color: (
            status === 'To Do' && '#FBC02D' ||
            status === 'In Progress' && '#1E88E5' ||
            status === 'Done' && '#388E3C' ||
            status === 'Cancelled' && '#D32F2F'
          ) || 'inherit'
          }}
        >{status || ""}
        </Typography>
      </TableCell>
      <TableCell align="left" padding="checkbox">
        <PriorityIcon priority={priority} />
      </TableCell>
      <TableCell align='right' > { fDate(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
