import PropTypes from 'prop-types';
import {
  TableCell,
  Stack,
} from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
import { StyledTableRow } from '../../../theme/styles/default-styles'
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

EmailListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function EmailListTableRow({
  row,
  selected,
  onViewRow,
}) {

  const { subject, customer, toEmails, fromEmail, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected}>
      <Stack direction="row" alignItems="center">
        <CustomAvatar
          name={subject}
          alt={subject}
          sx={{ ml: 1, my: 0.5, width: '30px', height: '30px' }} 
        />
        {/* <LinkTableCell align="left" onClick={onViewRow} param={subject} /> */}
        <TableCell align='left' > { subject || ''} </TableCell> 
      </Stack>
      <TableCell align='left' > { customer?.name || ''} </TableCell> 
      <TableCell align='left' > { fromEmail } </TableCell>
      <TableCell align='left' > { toEmails } </TableCell>
      <TableCell align='right' > { fDateTime(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
