import PropTypes from 'prop-types';
// @mui
import { Switch, TableRow, TableCell, Chip } from '@mui/material';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
// utils
import { fDate } from '../../../../utils/formatTime';
import { useScreenSize } from '../../../../hooks/useResponsive';

// ----------------------------------------------------------------------

GroupListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function GroupListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, categories, isActive, isDefault, createdAt } = row;
  
  const smScreen = useScreenSize('sm')

  return (
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} isDefault={isDefault}/>
        <TableCell align="left">
          {categories.map((category, index) =>
            <Chip key={index} label={category?.name} sx={{ ml: index===0?0:1 }} />
          )}
        </TableCell>
        <TableCell align="center"><Switch checked={isActive} disabled /></TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>

  );
}
