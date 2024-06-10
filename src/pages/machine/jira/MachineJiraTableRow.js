import PropTypes from 'prop-types';
// @mui
import { TableCell, Chip } from '@mui/material';
// utils
import { fDate, fDateTime } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles';
import { getJiraStatusSX } from '../../../utils/jira';

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
        <TableCell align="left">{fDateTime(fields?.created)}</TableCell>
        <LinkTableCell align="left" onClick={() => onViewRow( key )} param={key || ''} />
        <TableCell align="left">{fields?.summary || ''}</TableCell>
        <TableCell align="left">{fields?.status?.statusCategory?.name && <Chip sx={getJiraStatusSX(fields)} label={fields?.status?.statusCategory?.name || ''} />}</TableCell>
      </StyledTableRow>
  );
}
