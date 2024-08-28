import PropTypes from 'prop-types';
// @mui
import { Switch, TableRow, TableCell, Chip } from '@mui/material';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
// utils
import { fDate } from '../../../../utils/formatTime';

// ----------------------------------------------------------------------

DepartmentListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function DepartmentListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { departmentName, departmentType, isActive, forCustomer, isDefault, createdAt } = row;
  
  return (
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={departmentName} isDefault={isDefault}/>
        <TableCell align="center">{departmentType ? <Chip label={departmentType} /> : ""}</TableCell>
        <TableCell align="center">
          <Switch checked={isActive} disabled sx={{ my: -1 }} />{' '}
        </TableCell>        
        <TableCell align="center">
          <Switch checked={forCustomer} disabled sx={{ my: -1 }} />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>
  );
}
