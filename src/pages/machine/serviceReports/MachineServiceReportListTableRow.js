import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell } from '@mui/material';
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

  const { serviceReportTemplate, serviceReportUID, status, currentApprovalStatus, serviceDate, isActive, createdAt, createdBy } = row;
  
  return (
      <StyledTableRow hover selected={selected}>
        <TableCell align="left"><Switch checked={isActive} disabled size="small" /></TableCell> 
        <LinkTableCell align="left" onClick={onViewRow} param={fDate(serviceDate)} />
        <LinkTableCell align="left" onClick={onViewRow} param={serviceReportUID} />
        <TableCell align="left">{ `${currentApprovalStatus !== "PENDING" ? currentApprovalStatus : status?.name || ''} `}</TableCell>
        <TableCell align="left">{ status?.type || "" }</TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={`${serviceReportTemplate?.reportTitle ? serviceReportTemplate?.reportTitle	: ''	} ${serviceReportTemplate?.reportType ? ' - ' : ''} ${serviceReportTemplate?.reportType ? serviceReportTemplate?.reportType : ''}`} />
        <TableCell align="left">{createdBy.name}</TableCell>
      </StyledTableRow>

  );
}
