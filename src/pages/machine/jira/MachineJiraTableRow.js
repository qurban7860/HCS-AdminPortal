import PropTypes from 'prop-types';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDateTime } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

MachineJiraTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  selectedLength: PropTypes.number,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function MachineJiraTableRow({
  row,
  style,
  selected,
  selectedLength,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { id, self, key, fields, expand } = row;

  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={() => onViewRow(self)} param={key || ''} />
        <TableCell align="left">{fields?.status?.name || ''}</TableCell>
        <TableCell align="left">{fields?.summary || ''}</TableCell>
        <TableCell align="left">{fields?.description?.content[0]?.content[0]?.text || ''}</TableCell>
      </StyledTableRow>
  );
}
