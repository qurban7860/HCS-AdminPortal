import PropTypes from 'prop-types';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// components
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

TechParamCategoryListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function TechParamCategoryListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, isActive, createdAt } = row;

  return (
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} stringLength={50} param={name} />
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" sx={{ my: -1 }} />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>
  );
}
