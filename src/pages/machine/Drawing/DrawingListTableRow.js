import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

DrawingListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func
};

export default function DrawingListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow
}) {
  const {
    document,
    documentType,
    documentCategory,
    isActive,
    createdAt,
  } = row;

  const smScreen = useScreenSize('sm')
  
  return (
      <StyledTableRow hover selected={selected}>
        <TableCell>{document?.referenceNumber}</TableCell>
        <LinkTableCell param={document?.displayName} onClick={onViewRow} />
        <TableCell>{document?.stockNumber}</TableCell>
        { smScreen && <TableCell>{documentType?.name}</TableCell>}
        { smScreen && <TableCell>{documentCategory?.name}</TableCell>}
        <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>
  );
}
