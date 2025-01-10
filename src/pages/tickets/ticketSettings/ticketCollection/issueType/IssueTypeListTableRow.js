import PropTypes from 'prop-types';
import {
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../../../utils/formatTime';
import { StyledTableRow } from '../../../../../theme/styles/default-styles'
import LinkTableCell from '../../../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

IssueTypeListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function IssueTypeListTableRow({
  row,
  selected,
  onViewRow,
}) {

  const { name, slug, displayOrderNo, isDefault, createdAt } = row;
  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" onClick={onViewRow} param={name} isDefault={isDefault} />
      <TableCell align='left' > {slug} </TableCell> 
      <TableCell align='left' > { displayOrderNo} </TableCell>
      <TableCell align='right' > { fDate(createdAt) } </TableCell>
    </StyledTableRow>
  );
}
 