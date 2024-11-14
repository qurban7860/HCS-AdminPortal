import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import HistoryIcon from '../../../components/Icons/HistoryIcon';
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
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { serviceReportTemplate, serviceReportUID, status, currentApprovalStatus, versionNo, serviceDate, primaryServiceReportId, isActive, currentVersion, createdAt, createdBy } = row;
  const handleServiceReportHistory = () => navigate(PATH_MACHINE.machines.serviceReports.history.root(machineId, primaryServiceReportId));
  
  return (
      <StyledTableRow hover selected={selected}>
        <TableCell align="left">{fDate(serviceDate)}</TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={serviceReportUID} />
        <TableCell align="left">{ `${currentApprovalStatus !== "PENDING" ? currentApprovalStatus : status?.name || ''} ${status?.type ? `(${status.type})` : ""}`}</TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={`${serviceReportTemplate?.reportTitle ? serviceReportTemplate?.reportTitle	: ''	} ${serviceReportTemplate?.reportType ? ' - ' : ''} ${serviceReportTemplate?.reportType ? serviceReportTemplate?.reportType : ''}`} />
        <TableCell align="left" sx={{display: 'flex', alignItems:'center'}} >{versionNo} 
              {currentVersion?.versionNo > 1 && <HistoryIcon callFunction={handleServiceReportHistory} /> }</TableCell>
        <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell> 
        <TableCell align="left">{createdBy.name}</TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

  );
}
