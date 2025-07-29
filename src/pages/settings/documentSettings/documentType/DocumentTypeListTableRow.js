import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../../hooks/useResponsive';
import { StyledTableRow } from '../../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

DocumentTypeListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
};


export default function DocumentTypeListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  hiddenColumns,
}) {
  const { name, docCategory, customerAccess, isActive, isDefault, updatedAt } = row;

  return (
    <StyledTableRow hover selected={selected}>
      {useScreenSize('lg') && !hiddenColumns?.name && (
        <LinkTableCell align="left" param={name} onClick={onViewRow} isDefault={isDefault} />
      )}
      
      {useScreenSize('lg') && !hiddenColumns?.["docCategory.name"] && (
        <TableCell align="left">{docCategory?.name}</TableCell>
      )}
      
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
  );
}
