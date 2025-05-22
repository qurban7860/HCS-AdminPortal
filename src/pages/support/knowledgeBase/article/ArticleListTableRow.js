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
  const { serialNumber, title, description, category, isActive, updatedAt } = row;

  return (
    <StyledTableRow hover selected={selected}>
      {/* <TableCell align="left">{serialNumber}</TableCell> */}
      <LinkTableCell align="left" onClick={onViewRow} param={`${prefix}-${serialNumber}`} />
      <TableCell align="left">{title}</TableCell>
      <TableCell align="left" dangerouslySetInnerHTML={{ __html: description }} />
      <TableCell align="left">{category?.name}</TableCell>
      <TableCell align="center">
        <Switch checked={isActive} disabled size="small" />
      </TableCell>
      <TableCell align="right">{fDate(updatedAt)}</TableCell>
    </StyledTableRow>
  );
}
