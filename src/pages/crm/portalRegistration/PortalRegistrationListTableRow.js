import PropTypes from 'prop-types';
// @mui
import {
  TableCell, Chip
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

PortalRegistrationListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  handleCustomerDialog: PropTypes.func,
  onViewGroupCustomer: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function PortalRegistrationListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  handleCustomerDialog,
  onViewGroupCustomer,
}) {
  const { contactPersonName, email, phoneNumber, address, customerName, machineSerialNos, status, createdAt } = row;
  
  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" onClick={onViewRow} param={contactPersonName} />
      <TableCell align="left">{email || ''}</TableCell>
      <TableCell align="left">{phoneNumber}</TableCell>
      <TableCell align="left">{address}</TableCell>
      <TableCell align="left">{customerName}</TableCell>
      <TableCell align="left">{Array.isArray( machineSerialNos ) && (  machineSerialNos?.map((m, index )=> m?.trim() && <Chip key={`${index}${row?._id}`} sx={{ m:0.2 }} label={ m?.trim() } /> ) || '' )}</TableCell>
      <TableCell align="left">{status || ""} {status?.toUpperCase() === "ACCEPTED" && <Iconify onClick={handleCustomerDialog} icon="solar:user-id-bold" />}</TableCell> 
      <TableCell align="right" >{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
