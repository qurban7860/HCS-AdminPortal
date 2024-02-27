import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
  Chip,
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import { useScreenSize } from '../../hooks/useResponsive';
import { StyledTableRow } from '../../theme/styles/default-styles'

// ----------------------------------------------------------------------

CustomerContactListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CustomerContactListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { firstName, lastName, title, phone, email, address, isActive, createdAt } = row;
  const smScreen = useScreenSize('sm')
  const mdScreen = useScreenSize('md')
  
  return (
    <StyledTableRow hover selected={selected}>
      <TableCell>{firstName} {lastName}</TableCell>
      {smScreen && mdScreen && <TableCell>{title}</TableCell>}
      {smScreen && <TableCell>{phone}</TableCell>}
      <TableCell>{email}</TableCell>
      {smScreen && mdScreen && <TableCell>{address?.country}</TableCell>}
      <TableCell align='center'><Switch checked={isActive} disabled size="small" /></TableCell>
      {mdScreen && <TableCell align='right'>{fDate(createdAt)}</TableCell>}
    </StyledTableRow>
  );
}
