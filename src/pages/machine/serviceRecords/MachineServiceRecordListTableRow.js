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

MachineServiceRecordListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};


export default function MachineServiceRecordListTableRow({
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
  const { serviceRecordConfig, serviceRecordUid, status, versionNo, serviceDate, serviceId, isActive, currentVersion, createdAt, createdBy } = row;
  const handleServiceRecordHistory = () => navigate(PATH_MACHINE.machines.serviceRecords.history.root(machineId, serviceId ))

  return (
      <StyledTableRow hover selected={selected}>
        <TableCell align="left">{fDate(serviceDate)}</TableCell>
        <TableCell align="left">{serviceRecordUid}</TableCell>
        <TableCell align="left">{status || ''}</TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={`${serviceRecordConfig?.docTitle ? serviceRecordConfig?.docTitle	: ''	} ${serviceRecordConfig?.recordType ? ' - ' : ''} ${serviceRecordConfig?.recordType ? serviceRecordConfig?.recordType : ''}`} />
        <TableCell align="left" sx={{display: 'flex', alignItems:'center'}} >{versionNo} 
              {currentVersion?.versionNo > 1 && <HistoryIcon callFunction={handleServiceRecordHistory} /> }</TableCell>
        <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
        <TableCell align="left">{createdBy.name}</TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

  );
}
