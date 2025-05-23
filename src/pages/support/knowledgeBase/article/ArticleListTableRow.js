import PropTypes from 'prop-types';
// @mui
import {
  Collapse,
  Divider,
  IconButton,
  Paper,
  Switch,
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../../theme/styles/default-styles'
import { useBoolean } from '../../../../hooks/useBoolean';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

ArticleListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  prefix: PropTypes.string,
};


export default function ArticleListTableRow({
  row,
  style,
  selected,
  onViewRow,
  prefix,
}) {
  const { articleNo, title, status, category, isActive, updatedAt } = row;

  const renderPrimary = (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell onClick={onViewRow} param={`${prefix}-${articleNo}`} />
      <TableCell>{title}</TableCell>
      <TableCell>{category?.name}</TableCell>
      <TableCell>{status}</TableCell>
      <TableCell>
        <Switch checked={isActive} disabled size="small" />
      </TableCell>
      <TableCell align="right">{fDate(updatedAt)}</TableCell>
    </StyledTableRow>
  );

  return (renderPrimary);
}
