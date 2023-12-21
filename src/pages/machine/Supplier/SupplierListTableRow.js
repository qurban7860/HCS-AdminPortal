import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
// utils
// import { fData, fCurrency } from '../../../utils/formatNumber';
// components
// import Label from '../../../components/label';
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
// import { useSelector } from '../../../redux/store';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

SupplierListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function SupplierListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, contactName, address, isActive, isDefault, createdAt } = row;

  const smScreen = useScreenSize('sm')
  const lgScreen = useScreenSize('lg')

  return (
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} isDefault={isDefault} />
        { smScreen && <TableCell>{contactName}</TableCell>}
        { lgScreen && <TableCell>{address?.city}</TableCell>}
        { smScreen && <TableCell>{address?.country}</TableCell>}
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" sx={{ my: -1 }} />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>
  );
}
