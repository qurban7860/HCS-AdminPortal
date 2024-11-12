import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

MachineServiceReportListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function MachineServiceReportListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { isHistory, versionNo, serviceDate, status, currentApprovalStatus, isActive, createdAt, createdBy } = row;
  return (
      <StyledTableRow hover selected={selected}>
        <TableCell align="left" >{fDate(serviceDate)}</TableCell>
        <TableCell align="left" >{currentApprovalStatus !== "PENDING" ? currentApprovalStatus : status?.name || "" }</TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={`${versionNo || 1} ${!isHistory && status?.name?.toUpperCase() !=="DRAFT"? '(Current Version)' : ''}`} />
        <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
        <TableCell align="left">{createdBy.name}</TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

  );
}
