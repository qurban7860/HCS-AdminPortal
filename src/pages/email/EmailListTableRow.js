import PropTypes from 'prop-types';
import {
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

EmailListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "white",
  },
  '&:nth-of-type(even)': {
    backgroundColor: "#f4f6f866",
  },
}));

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
