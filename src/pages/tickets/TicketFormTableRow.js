import PropTypes from 'prop-types';
import {
  TableCell,
  Stack,
  useTheme,
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
  const theme = useTheme();

  return (
    <StyledTableRow hover selected={selected}>
      <TableCell align="left">
        <Stack direction="row" alignItems="center" spacing={-1.5} >
          {issueType?.icon && (
            <StyledTooltip placement="top" title={issueType.name || ''} 
              tooltipcolor={theme.palette.primary.main} >
              <Iconify icon={issueType.icon} style={{ width: 25, height: 25,  color: theme.palette.primary.main }}  />
            </StyledTooltip>
          )}
          <LinkTableCell align="left" onClick={() => onViewRow(ticketNo)} param={ticketNo || ''} />
        </Stack>
      </TableCell>
      <Stack direction="row" alignItems="center">
        <LinkTableCell align="left" onClick={onViewRow} param={summary || ''} /> 
      </Stack>
      <TableCell align="left" padding="checkbox">
        {status?.icon ? (
          <StyledTooltip 
           placement="top" 
           title={status.name || ''} 
           tooltipcolor={theme.palette.primary.main} >
           <Iconify icon={status.icon} style={{ width: 25, height: 25, color: theme.palette.primary.main }}  />
          </StyledTooltip>
        ) : (
          ''
        )}
      </TableCell>
      <TableCell align="left" >
        {priority?.icon ? (
          <StyledTooltip 
           placement="top" 
           title={priority.name || ''} 
           tooltipcolor={theme.palette.primary.main} >
           <Iconify icon={priority.icon} style={{ width: 25, height: 25, color: theme.palette.primary.main }}  />
          </StyledTooltip>
        ) : (
          ''
        )}
      </TableCell>
      <TableCell align='left' > { customer?.name || ''} </TableCell>
      <TableCell align='left' > { machine?.serialNo || ''} </TableCell>
      <TableCell align='right' > { fDate(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
