import PropTypes from 'prop-types';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDate, fDateTime } from '../../../utils/formatTime';
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

  const jiraServiceManagemntUrl = `https://howickltd.atlassian.net/jira/servicedesk/projects/HWKSC/queues/custom/3/${key}`

  return (
      <StyledTableRow hover selected={selected}>
        <TableCell align="left">{fDateTime(fields?.created) || ''}</TableCell>
        <LinkTableCell align="left" onClick={() => onViewRow( jiraServiceManagemntUrl )} param={key || ''} />
        <TableCell align="left">{fields?.status?.name || ''}</TableCell>
        <TableCell align="left">{fields?.summary || ''}</TableCell>
      </StyledTableRow>
  );
}
