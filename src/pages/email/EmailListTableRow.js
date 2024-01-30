import PropTypes from 'prop-types';
import {
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
import { StyledTableRow } from '../../theme/styles/default-styles'

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

  if (!row || typeof row !== 'object' || !row.sujecr) {
    return <div>No valid row data</div>;
  }
  const { createdAt } = row;
  return (
    <StyledTableRow hover selected={selected}>
      <TableCell align="right"/>
      <TableCell>{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
