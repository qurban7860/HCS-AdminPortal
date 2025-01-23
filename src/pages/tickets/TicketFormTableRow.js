import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  TableCell,
  Stack,
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
import { getMachineForDialog, setMachineDialog } from '../../redux/slices/products/machine';
import { StyledTableRow, StyledTooltip } from '../../theme/styles/default-styles'
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import Iconify from '../../components/iconify';
import LinkDialogTableCell from '../../components/ListTableTools/LinkDialogTableCell';

// ----------------------------------------------------------------------

TicketFormTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  handleCustomerDialog:PropTypes.func,
};

export default function TicketFormTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  handleCustomerDialog,
}) {
  const dispatch = useDispatch();
  const { ticketNo, customer, machine, issueType, summary, priority, status, createdAt } = row;
  
  const handleMachineDialog = async ( event, MachineID ) => {
    event.preventDefault(); 
    await dispatch(getMachineForDialog(MachineID));
    await dispatch(setMachineDialog(true)); 
  };
  
  return (
    <StyledTableRow hover selected={selected}>
      <TableCell align="left" padding="checkbox">
        <Stack direction="row" alignItems="center" >
        <StyledTooltip placement="top" title={issueType?.name || ''} 
          tooltipcolor={issueType?.color} >
          <Iconify icon={issueType?.icon} style={{ width: 25, height: 25,  color: issueType?.color }}  />
        </StyledTooltip>
        </Stack>
      </TableCell>
      <LinkTableCell align="left" onClick={() => onViewRow(ticketNo)} param={ticketNo || ''} />
      <Stack direction="row" alignItems="center">
        <LinkTableCell align="left" onClick={onViewRow} param={summary || ''} /> 
      </Stack>
      
      <LinkTableCell align="left" onClick={(event) => handleMachineDialog(event, row.machine?._id)} param={machine?.serialNo || ''} /> 
      <TableCell align='left' > { machine?.machineModel?.name || ''} </TableCell>
      <LinkDialogTableCell onClick={handleCustomerDialog} align='center' param={customer?.name || ''}/> 
      <TableCell align="left" padding="checkbox">
        <StyledTooltip 
          placement="top" 
          title={status?.name || ''} 
          tooltipcolor={status?.color} >
          <Iconify icon={status?.icon} style={{ width: 25, height: 25, color: status?.color }}  />
        </StyledTooltip>
      </TableCell>
      <TableCell align="left" padding="checkbox">
        <StyledTooltip 
          placement="top" 
          title={priority?.name || ''} 
          tooltipcolor={priority?.color} >
          <Iconify icon={priority?.icon} style={{ width: 25, height: 25, color: priority?.color }}  />
        </StyledTooltip>
      </TableCell>
      <TableCell align='right' > { fDate(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
