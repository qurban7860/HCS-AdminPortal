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
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';

// ----------------------------------------------------------------------

CustomerContactListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage: PropTypes.func,
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
  openInNewPage
}) {
  const { customer, firstName, lastName, title, phone, email, address, isActive, createdAt } = row;
  const smScreen = useScreenSize('sm')
  const mdScreen = useScreenSize('md')
  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCellWithIconTargetBlank onViewRow={onViewRow} onClick={openInNewPage} param={customer?.name || ''} />
      <TableCell>{firstName} {lastName}</TableCell>
      {smScreen && <TableCell>{phone}</TableCell>}
      <TableCell>{email}</TableCell>
      {smScreen && mdScreen && <TableCell>{address?.country}</TableCell>}
      {smScreen && <TableCell align='center'><Switch checked={isActive} disabled size="small" /></TableCell>}
      {mdScreen && <TableCell align='right'>{fDate(createdAt)}</TableCell>}
    </StyledTableRow>
  );
}
