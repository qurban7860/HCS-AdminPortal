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
  hiddenColumns: PropTypes.object,
};

export default function DepartmentListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  hiddenColumns,
}) {
  const { departmentName, departmentType, isActive, forCustomer, isDefault, updatedAt } = row;
  
  return (
    <TableRow hover selected={selected}>
      {!hiddenColumns?.departmentName && (
        <LinkTableCell align="left" onClick={onViewRow} param={departmentName} isDefault={isDefault}/>
      )}
      

        {!hiddenColumns?.departmentType && (
        <TableCell align="center">{departmentType ? <Chip label={departmentType} /> : ""}</TableCell>
      )}
      

      {!hiddenColumns?.isActive && (
        <TableCell align="center">
          <Switch checked={isActive} disabled size = "small" />
        </TableCell>
      )}

      
      {!hiddenColumns?.forCustomer && (
        <TableCell align="center">
          <Switch checked={forCustomer} disabled size = "small" />
        </TableCell>
      )}

      
      {!hiddenColumns?.updatedAt && (
        <TableCell align="right">{fDate(updatedAt)}</TableCell>
      )}
    </TableRow>

  );
}
