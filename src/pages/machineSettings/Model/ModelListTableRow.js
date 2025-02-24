import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
// components
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

ModelListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ModelListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, category, isActive, isDefault, updatedAt } = row;

  const smScreen = useScreenSize('sm')

  return (

      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} isDefault={isDefault} />
        { smScreen && <TableCell align="left">{category?.name || ''}</TableCell>}

        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled sx={{ my: -1 }} />{' '}
        </TableCell>

        <TableCell align="right">{fDate(updatedAt)}</TableCell>
      </TableRow>

  );
}
