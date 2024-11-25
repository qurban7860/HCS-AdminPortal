import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// @mui
import { TableCell } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow, StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import { ICONS } from '../../../constants/icons/default-icons';
import { getMachineForDialog, setMachineDialog } from '../../../redux/slices/products/machine';
import { getCustomer, setCustomerDialog } from '../../../redux/slices/customer/customer';

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

  const { serviceReportTemplate, serviceReportUID, status, currentApprovalStatus, customer, machine, serviceDate, isActive, createdBy } = row;
  
  const dispatch = useDispatch();
  const handleCustomerDialog = async (event, customerId) => {
    event.preventDefault(); 
    await dispatch(getCustomer(customerId));
    await dispatch(setCustomerDialog(true));
  };

  const handleMachineDialog = async ( event, MachineID ) => {
    event.preventDefault(); 
    await dispatch(getMachineForDialog(MachineID));
    await dispatch(setMachineDialog(true)); 
  };

  return (
      <StyledTableRow hover selected={selected} >
        <TableCell align="left" padding="checkbox"  >
          <StyledTooltip
            placement="top" 
            title={ isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading} 
            disableFocusListener tooltipcolor={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color} 
            color={ isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
          >
            <Iconify icon={ isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon }/>
          </StyledTooltip>
        </TableCell>
        <TableCell>
          { fDate(serviceDate) }
        </TableCell>
        <TableCell>
          {serviceReportTemplate?.reportType || "" }
        </TableCell>
        <LinkTableCell align="left" onClick={onViewRow} param={ serviceReportUID } />
        <LinkTableCell align="left" 
          onClick={ (event)=> handleMachineDialog(event, machine?._id) } 
          param={ machine?.serialNo || "" } 
        />
        <LinkTableCell align="left" 
          onClick={(event)=> handleCustomerDialog(event, customer?._id)} 
          param={ customer?.name || "" } 
        />
        <TableCell align="left">{ `${currentApprovalStatus !== "PENDING" ? currentApprovalStatus : status?.name || ''} `}</TableCell>
        <TableCell align="left">{createdBy.name}</TableCell>
      </StyledTableRow>

  );
}
