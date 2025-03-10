import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
  Chip,
} from '@mui/material';
// utils
import { fDate, fDateTime } from '../../../../utils/formatTime';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../../hooks/useResponsive';
import { StyledTableRow } from '../../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

UserInviteListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function UserInviteListTableRow({
  row,
  selected,
  onViewRow
}) {
  const smScreen = useScreenSize('sm')

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REVOKED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" param={`${row?.name || ""} (${row?.receiverInvitationEmail || row?.email || ''})`} onClick={onViewRow} />
      {smScreen && <TableCell>{row?.senderInvitationUser?.name || ""}</TableCell>}
      <TableCell>
        <Chip
          label={row?.invitationStatus || ""}
          color={getStatusColor(row.invitationStatus)}
          size="small"
        />
      </TableCell>
      <TableCell>{fDateTime(row?.inviteExpireTime)}</TableCell>
      {smScreen && <TableCell>{fDate(row?.createdAt)}</TableCell>}
    </StyledTableRow>
  );
}