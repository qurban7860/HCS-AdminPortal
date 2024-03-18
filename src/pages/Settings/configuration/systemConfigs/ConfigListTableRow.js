import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
// components
import { fDateTime } from '../../../../utils/formatTime';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../../hooks/useResponsive';

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
  const { name, type, value, updatedBy, updatedAt, isActive } = row;
  const mdScreen = useScreenSize('lg')
  const smScreen = useScreenSize('sm')
  return (
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} />
        <TableCell sx={{ textTransform: 'capitalize' }}>{value}</TableCell>
        { smScreen && <TableCell>{type}</TableCell>}
        <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
        { mdScreen && <TableCell >{updatedBy?.name}</TableCell>}
        { mdScreen && <TableCell align="right" sx={{ textTransform: 'capitalize' }}>{fDateTime(updatedAt)}</TableCell>}
      </TableRow>
  );
}
