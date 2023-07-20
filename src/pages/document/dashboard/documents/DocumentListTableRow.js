import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell } from '@mui/material';
import { StyledTableRow } from '../../../../theme/styles/document-styles';
// utils
import { fDate } from '../../../../utils/formatTime';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';

// ----------------------------------------------------------------------

DocumentListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function DocumentListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    displayName,
    docType,
    machine,
    customer,
    docCategory,
    customerAccess,
    isActive,
    createdAt,
  } = row;

  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" param={displayName} onClick={onViewRow} />
      <TableCell align="left">{docType?.name}</TableCell>
      <TableCell align="left">{docCategory?.name}</TableCell>
      <TableCell align="center">
        <Switch checked={customerAccess} disabled size="small" />{' '}
      </TableCell>
      <TableCell align="center">
        <Switch checked={isActive} disabled size="small" />{' '}
      </TableCell>
      <TableCell align="right">{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
