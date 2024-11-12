import PropTypes from 'prop-types';
// @mui
import { Switch, TableRow,  TableCell } from '@mui/material';
// components;
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

ServiceReportStatusListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ServiceReportStatusListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const smScreen = useScreenSize('sm')

  const { name, type, displayOrderNo, isActive, isDefault, createdAt } = row;

  return (
      <TableRow hover selected={selected}>
        <LinkTableCell onClick={onViewRow} align="left" param={name} isDefault={isDefault} />
        { smScreen &&<TableCell align="left" >{type}</TableCell>}
        <TableCell align="left" >{displayOrderNo}</TableCell>
        <TableCell align="center">
          <Switch checked={isActive} disabled size="small" sx={{ my: -1 }} />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>
  );
}
