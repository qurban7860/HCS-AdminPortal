import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

ProjectListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  prefix: PropTypes.string,
};


export default function ProjectListTableRow({
  row,
  style,
  selected,
  onViewRow,
  prefix
}) {
  const { projectNo, name, isActive, updatedAt } = row;

  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell onClick={onViewRow} param={`${prefix}-${projectNo}`} />
      <LinkTableCell onClick={onViewRow} param={name} />
      <TableCell>
        <Switch checked={isActive} disabled size="small" />
      </TableCell>
      <TableCell align="right">{fDate(updatedAt)}</TableCell>
    </StyledTableRow>
  );
}
