import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

UserInviteListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

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
        <TableCell>{fDate(row.inviteExpireTime)}</TableCell>
        { smScreen && <TableCell>{fDate(row.createdAt)}</TableCell>}
      </StyledTableRow>
  );
}
