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
import { fDate, fDateTime } from '../../utils/formatTime';
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
};

export default function JiraTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {

  const { id, self, key, Organizations, fields, expand } = row;
  const smScreen = useScreenSize('sm')
  const lgScreen = useScreenSize('lg')
  
  // fields.customfield_10069 -> Serial No
  // fields.customfield_10070.value -> Model Name
  // fields.customfield_10078 -> oragnization

  return (
    <StyledTableRow hover selected={selected}>
      <TableCell align="left">{fDateTime(fields?.created)}</TableCell>
      <LinkTableCell align="left" onClick={() => onViewRow( key )} param={key || ''} />
      <TableCell align="left">{fields?.summary || ''}</TableCell>
      <TableCell align="left">{fields?.customfield_10078 || ''}</TableCell>
      <TableCell align="left">{fields?.customfield_10069 || ''}</TableCell>
      <TableCell align="left">{fields?.customfield_10070?.value || ''}</TableCell>
      <TableCell align="left">{fields?.status?.statusCategory?.name && <Chip sx={getJiraStatusSX(fields)} label={fields?.status?.name || ''} />}</TableCell>
    </StyledTableRow>
  );
}
