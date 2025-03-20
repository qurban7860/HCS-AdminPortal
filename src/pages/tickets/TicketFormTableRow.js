import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  TableCell,
  Stack,
} from '@mui/material';
import { PATH_SUPPORT } from '../../routes/paths';
// utils
import { fDate } from '../../utils/formatTime';
import { getMachineForDialog, setMachineDialog } from '../../redux/slices/products/machine';
import { StyledTableRow, StyledTooltip } from '../../theme/styles/default-styles'
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import Iconify from '../../components/iconify';
import LinkDialogTableCell from '../../components/ListTableTools/LinkDialogTableCell';
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
// import { useScreenSize } from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

TicketFormTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  handleCustomerDialog:PropTypes.func,
  hiddenColumns: PropTypes.object,
  prefix: PropTypes.string,
};

export default function TicketFormTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  handleCustomerDialog,
  hiddenColumns,
  prefix = '',
}) {
  const dispatch = useDispatch();
  const { ticketNo, customer, machine, issueType, summary, priority, status, createdAt, _id } = row;
  
  const handleMachineDialog = async ( event, MachineID ) => {
    event.preventDefault(); 
    await dispatch(getMachineForDialog(MachineID));
    await dispatch(setMachineDialog(true)); 
  };
  
  return (
    <StyledTableRow hover selected={selected}>
      { !hiddenColumns?.['issueType.name'] && (
        <TableCell align="left" padding="checkbox">
          <Stack direction="row" alignItems="center" >
            <StyledTooltip placement="top" title={issueType?.name || ''} 
              tooltipcolor={issueType?.color} >
              <Iconify icon={issueType?.icon} color={issueType?.color} />
            </StyledTooltip>
          </Stack>
        </TableCell>
      )}
      {!hiddenColumns?.ticketNo && (
        <LinkTableCellWithIconTargetBlank 
        onViewRow={() => onViewRow(ticketNo)} 
        onClick={() => window.open(PATH_SUPPORT.supportTickets.view(ticketNo), '_blank')}
        param={`${prefix || ''} - ${ticketNo || ''}`} />
      )}
      { !hiddenColumns?.summary && (
          <LinkTableCell align="left" onClick={onViewRow} param={summary || ''} /> 
      )}
      { !hiddenColumns?.['machine.serialNo'] && (
        <LinkTableCell align="left" onClick={(event) => handleMachineDialog(event, row.machine?._id)} param={machine?.serialNo || ''} />
      )}
      { !hiddenColumns?.['machine.machineModel.name'] && (
        <TableCell align='left' > { machine?.machineModel?.name || ''} </TableCell>
      )}
      { !hiddenColumns?.['customer.name'] && (
        <LinkDialogTableCell onClick={handleCustomerDialog} align='center' param={customer?.name || ''}/>
      )}
      { !hiddenColumns?.['status.name'] && (
        <TableCell align="left" padding="checkbox">
          <StyledTooltip 
            placement="top" 
            title={status?.name || ''} 
            tooltipcolor={status?.color} >
            <Iconify icon={status?.icon} color={status?.color} />
          </StyledTooltip>
        </TableCell>
      )}
      { !hiddenColumns?.['priority.name'] && (
        <TableCell align="left" padding="checkbox">
          <StyledTooltip 
            placement="top" 
            title={priority?.name || ''} 
            tooltipcolor={priority?.color} >
            <Iconify icon={priority?.icon} color={priority?.color} />
          </StyledTooltip>
        </TableCell>
      )}
      { !hiddenColumns?.createdAt && (
        <TableCell align='right' > { fDate(createdAt) } </TableCell>
      )}
    </StyledTableRow>
  );
}
