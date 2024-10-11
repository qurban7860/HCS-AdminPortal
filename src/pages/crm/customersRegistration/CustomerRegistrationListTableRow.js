import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'


// ----------------------------------------------------------------------

CustomerRegistrationListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onViewGroupCustomer: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function CustomerRegistrationListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onViewGroupCustomer,
}) {
  const { customerName, contactPersonName, status, isActive, createdAt } = row;
  
  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" onClick={onViewRow} param={customerName} />
      <TableCell align="left">{contactPersonName || ""}</TableCell>
      <TableCell align="left">{status || ""}</TableCell>
      <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
      <TableCell align="right" >{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
