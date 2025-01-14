import PropTypes from 'prop-types';
import {
  TableCell,
  Stack,
  Typography
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
import { StyledTableRow, StyledTooltip } from '../../theme/styles/default-styles'
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import Iconify from '../../components/iconify';

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
        {issueType?.icon ? (
          <StyledTooltip 
           placement="top" 
           title={issueType.name || ''} >
           <Iconify icon={issueType.icon} width={24} height={24} />
          </StyledTooltip>
        ) : (
          ''
        )}
      </TableCell>
      <TableCell align="left" padding="checkbox">
        {status?.icon ? (
          <StyledTooltip 
           placement="top" 
           title={status.name || ''} >
           <Iconify icon={status.icon} width={24} height={24} />
          </StyledTooltip>
        ) : (
          ''
        )}
      </TableCell>
      <TableCell align="left" padding="checkbox">
        {priority?.icon ? (
          <StyledTooltip 
           placement="top" 
           title={priority.name || ''} >
           <Iconify icon={priority.icon} width={24} height={24} />
          </StyledTooltip>
        ) : (
          ''
        )}
      </TableCell>
      <TableCell align='right' > { fDate(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
