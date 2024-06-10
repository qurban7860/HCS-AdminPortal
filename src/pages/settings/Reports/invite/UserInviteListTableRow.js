import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
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
  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={`${row?.receiverInvitationUser?.name} (${row?.receiverInvitationEmail})`} onClick={onViewRow} />
        {/* <TableCell>{row?.receiverInvitationUser?.name} ({row?.receiverInvitationEmail})</TableCell> */}
        { smScreen && <TableCell>{row?.senderInvitationUser?.name}</TableCell>}
        <TableCell>{row.invitationStatus}</TableCell>
        <TableCell>{fDateTime(row.inviteExpireTime)}</TableCell>
        { smScreen && <TableCell>{fDate(row.createdAt)}</TableCell>}
      </StyledTableRow>
  );
}
