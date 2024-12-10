import PropTypes from 'prop-types';
// @mui
import {
  TableCell, Chip, Typography
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'
import LinkTableCellWithIconTargetBlank from '../../../components/ListTableTools/LinkTableCellWithIconTargetBlank';

// ----------------------------------------------------------------------

PortalRegistrationListTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
  handleCustomerDialog: PropTypes.func,
  hiddenColumns: PropTypes.object,
};


export default function PortalRegistrationListTableRow({
  row,
  onViewRow,
  handleCustomerDialog,
  hiddenColumns,
}) {
  const { contactPersonName, email, phoneNumber, address, customerName, machineSerialNos, status, customer = null, contact, createdAt } = row;
  
  return (
    <StyledTableRow hover >
      <LinkTableCell align="left" onClick={onViewRow} param={contactPersonName} />
      {!hiddenColumns?.email && <TableCell align="left">{email || ''}</TableCell>}
      {!hiddenColumns?.phoneNumber && <TableCell align="left">{phoneNumber}</TableCell>}
      {!hiddenColumns?.address && <TableCell align="left">{address}</TableCell>}
      {!hiddenColumns?.customerName && ( customer?._id ? 
        <LinkTableCellWithIconTargetBlank 
          onViewRow={handleCustomerDialog}
          param={customer?.name || "" }
          align='left'
        /> 
        : <TableCell align="left">{customerName}</TableCell> )
      }
      {!hiddenColumns?.machineSerialNos && <TableCell align="left">{Array.isArray( machineSerialNos ) && (  machineSerialNos?.map((m, index )=> m?.trim() && <Chip key={`${index}${row?._id}`} sx={{ m:0.2 }} label={ m?.trim() } /> ) || '' )}</TableCell>}
      {!hiddenColumns?.status && <TableCell align="left">
        <Typography variant='subtitle2' sx={{mr: 1,
          color: (
            status === 'REJECTED' && 'red' ||
            status === 'APPROVED' && 'green'
          ) || 'inherit'
          }}
        >{status || ""}
        {/* {status?.toUpperCase() === "APPROVED" && <Iconify onClick={handleCustomerDialog}  icon="solar:user-id-bold" />} */}
        </Typography>
      </TableCell> }
      {!hiddenColumns?.['customer.name'] && <TableCell align="left">{customer?.name || ''}</TableCell>}
      {!hiddenColumns?.['contact.firstName'] && <TableCell align="left">{`${contact?.firstName || '' } ${contact?.lastName || ""}`}</TableCell>}
      {!hiddenColumns?.createdAt && <TableCell align="right" >{fDate(createdAt)}</TableCell>}
    </StyledTableRow>
  );
}
