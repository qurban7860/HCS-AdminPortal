import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
// components
import { fDateTime } from '../../utils/formatTime';
import LinkTableCell from '../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

ConfigListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
};

export default function ConfigListTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { name, value, updatedBy, updatedAt, isActive } = row;
  const smScreen = useScreenSize('sm')
  return (
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} />
        { smScreen && <TableCell align="left" sx={{ textTransform: 'capitalize' }}>{value}</TableCell>}
        <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
        <TableCell align="right">{updatedBy?.name}</TableCell>
        <TableCell align="right" sx={{ textTransform: 'capitalize' }}>{fDateTime(updatedAt)}</TableCell>
      </TableRow>
  );
}
