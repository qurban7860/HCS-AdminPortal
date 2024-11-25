import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  Stack,
  TableRow,
  TableCell,
  Chip
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import { fDate } from '../../utils/formatTime';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../hooks/useResponsive';
import BadgeStatus from '../../components/badge-status/BadgeStatus';
import { ICONS } from '../../constants/icons/default-icons';
import { StyledTableRow, StyledTooltip } from '../../theme/styles/default-styles';
import { getJiraStatusSX } from '../../utils/jira';

// ----------------------------------------------------------------------

JiraTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
};

export default function JiraTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  hiddenColumns
}) {

  const { id, self, key, Organizations, fields, expand } = row;
  const smScreen = useScreenSize('sm')
  const lgScreen = useScreenSize('lg')

  return (
    <StyledTableRow hover selected={selected}>
      {!hiddenColumns?.['fields.created'] && <TableCell align="left">{fDate(fields?.created)}</TableCell>}
      {!hiddenColumns?.key && <LinkTableCell align="left" onClick={() => onViewRow( key )} param={key || ''} />}
      {!hiddenColumns?.['fields.summary'] && <TableCell align="left">{fields?.summary || ''}</TableCell>}
      {!hiddenColumns?.['fields.customfield_10002[0].name'] && <TableCell align="left">{fields?.customfield_10002[0]?.name || ''}</TableCell>}
      {!hiddenColumns?.['fields.customfield_10069'] && <TableCell align="left">{fields?.customfield_10069 || ''}</TableCell>}
      {!hiddenColumns?.['fields.customfield_10070.value'] && <TableCell align="left">{fields?.customfield_10070?.value || ''}</TableCell>}
      {!hiddenColumns?.['fields.status.name'] && <TableCell align="left">{fields?.status?.statusCategory?.name && <Chip sx={getJiraStatusSX(fields)} label={fields?.status?.name || ''} />}</TableCell>}
    </StyledTableRow>
  );
}
