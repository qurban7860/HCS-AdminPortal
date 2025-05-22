import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

ArticleCategoryListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func
};


export default function ArticleCategoryListTableRow({
  row,
  style,
  selected,
  onViewRow,
}) {
  const { name, description, isActive, updatedAt } = row;

  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" onClick={onViewRow} param={name} />
      <TableCell align="left">{description}</TableCell>
      <TableCell align="center">
        <Switch checked={isActive} disabled size="small" />
      </TableCell>
      <TableCell align="right">{fDate(updatedAt)}</TableCell>
    </StyledTableRow>
  );
}
