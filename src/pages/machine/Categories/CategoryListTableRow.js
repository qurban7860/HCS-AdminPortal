import PropTypes from 'prop-types';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
// utils
import { fDate } from '../../../utils/formatTime';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

CategoryListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CategoryListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, isActive, isDefault, connections, createdAt } = row;

  const smScreen = useScreenSize('sm')

  return (
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} isDefault={isDefault}/>
        { smScreen && <TableCell align="center">
          <Switch checked={connections || false} disabled sx={{ my: -1 }} />{' '}
        </TableCell>}

        <TableCell align="center">
          <Switch checked={isActive} disabled sx={{ my: -1 }} />{' '}
        </TableCell>

        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>

  );
}
