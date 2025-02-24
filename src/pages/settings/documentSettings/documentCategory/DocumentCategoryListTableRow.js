import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
  Chip
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../../hooks/useResponsive';
import { StyledTableRow } from '../../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

DocumentCategoryListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
};

export default function DocumentCategoryListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  hiddenColumns,
}) {
  const { name, customer, machine, drawing,  customerAccess, isActive, isDefault, updatedAt } = row;

  return (
    <>
      <StyledTableRow hover selected={selected}>
        {useScreenSize('lg') && !hiddenColumns?.name && (
          <LinkTableCell align="left" onClick={onViewRow} param={name} isDefault={isDefault} />
        )}
        
        {useScreenSize('lg') && !hiddenColumns?.customer && 
          <TableCell>
            {customer ? <Chip label="Customer" sx={{m:0.2}} />: ''}
            {machine ? <Chip label="Machine" sx={{m:0.2}} />: ''}
            {drawing ? <Chip label="Drawing" sx={{m:0.2}} />: ''}
          </TableCell>
        }
        
        {useScreenSize('lg') && !hiddenColumns?.customerAccess && (
          <TableCell align="center">
            <Switch checked={customerAccess} disabled size="small" />
          </TableCell>
        )}
        
        {useScreenSize('lg') && !hiddenColumns?.isActive && (
          <TableCell align="center">
            <Switch checked={isActive} disabled size="small" />
          </TableCell>
        )}
        
        {useScreenSize('lg') && !hiddenColumns?.createdAt && (
          <TableCell align="right">{fDate(updatedAt)}</TableCell>
        )}
      </StyledTableRow>
      {}
    </>
  );
}
